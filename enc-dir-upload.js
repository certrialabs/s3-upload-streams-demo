#!/usr/bin/env node

'use strict';

let argv = require('yargs').argv;
let walk = require('walk');
let path = require('path');
let fs = require('fs');
let aws = require('aws-sdk');
let Uploader = require('s3-upload-streams');
let crypto = require('crypto');
let zlib = require('zlib');

let dirname = argv.dir;
let bucket = argv.awsBucket;
let accessKeyId = argv.awsAccessKeyId;
let accessKeySecret = argv.awsAccessKeySecret;
let region = argv.awsRegion;
let concurrentFiles = argv.concurentFiles || 5;
let partSize = argv.awsPartSize || 5242880; //eslint-disable-line no-inline-comments 5MB
let maxConcurentUploads = argv.concurentUploads || 10;
let ssl = argv.awsSslEnabled || true;
let password = 'foo';
let algorithm = 'aes-256-ctr';

let currentUploads = 1;
let s3 = new aws.S3({
  accessKeyId: accessKeyId,
  secretAccessKey: accessKeySecret,
  region: region,
  sslEnabled: ssl
});

let s3Uploader = new Uploader(s3, bucket, partSize, maxConcurentUploads);
let walker = walk.walk(dirname);
walker.on("file", (root, fileStats, next) => {
  let tryNext = () => {
    if (currentUploads < concurrentFiles) {
      currentUploads = currentUploads + 1;
      next();
    }
  };

  let ap = path.join(root, fileStats.name);
  let rp = path.relative(dirname, ap).replace('\\', '/');
  let stream = fs.createReadStream(ap).pipe(zlib.createGzip()).pipe(crypto.createCipher(algorithm, password));

  let uploadIdPromise = s3Uploader.startUpload({ Key: rp }, stream, { orginalPath: rp });
  stream.on('end', () => {
    uploadIdPromise
    .then(uploadId => s3Uploader.completeUpload(uploadId))
    .then((metadata) => {
      console.log(`Uploaded ${metadata.additionalMetadata.orginalPath} to ${metadata.location}`);
      currentUploads = currentUploads - 1;
      tryNext();
    })
    .catch(err => console.log(err));
  });

  tryNext();
});

walker.on("errors", (root, nodeStatsArray, next) => {
  console.log('Error occured');
  next();
});

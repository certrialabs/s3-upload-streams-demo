# s3-upload-streams-demo
A set of demo scripts that show the most important use cases of [s3-upload-streams](https://github.com/elsix/s3-upload-streams) library.
These scripts are not production ready and you I strongly advice to use them only as reference and ideas.
This repo works on node 4 and later.

# Launch
To launch any of the examples you have to:

1. Clone this repo.

 `git clone https://github.com/elsix/s3-upload-streams-demo.git`
2. Install all dependencies.

 `npm install`
3. Start an example.

 `node <script-name> --awsBucket <your-bucket-goes-here> --awsAccessKeyId <aws-access-key-id> --awsAccessKeySecret <aws-access-key-secret> --awsRegion <region-id> <example-specific-params> `

# Common Parameters
## Required

 `--awsBucket` - Bucket that will be used for the uploads.
 
 `--awsAccessKeyId`- Your [awsAccessKeyId](https://www.cloudberrylab.com/blog/how-to-find-your-aws-access-key-id-and-secret-access-key-and-register-with-cloudberry-s3-explorer/).
 
 `--awsAccessKeySecret`- Your [awsAccessKeySecert](https://www.cloudberrylab.com/blog/how-to-find-your-aws-access-key-id-and-secret-access-key-and-register-with-cloudberry-s3-explorer/).
 
 `--awsRegion` - The region that you want to use as default.
 
## Optional

 `--awsPartSize` - The size of chunks that will be uploaded to s3. 
 
 `--concurentUploads`- The maximum number of chunks that will be uploaded to s3 simultaneously.
 
 `--awsSslEnabled` - Enables and disables ssl for communication with s3.
# Examples
 Each example is a standalone nodes script. You can launch all of them using
 ## Encryption Directory Upload
This example illustrates how to upload multiple objects(compressed and encrypted files) which length you don't know beforehand.
It illustrates a basic usage of node streaming API and how it integrates with [s3-upload-streams](https://github.com/elsix/s3-upload-streams) module.

Script specific parameters:

 `--dir` - This is the path to directory that you want to upload to destination bucket.
 
 `--concurentFiles` - This number sets maximum simultaneously file streams that will be opened from the script. This is useful if you want to limit the number of opened file descriptors for a big directory.
 You can see this it [here](https://github.com/elsix/s3-upload-streams-demo/blob/master/enc-dir-upload.js).

## Big File Upload

This example tries to illustrate a more advanced usage of [s3-upload-streams](https://github.com/elsix/s3-upload-streams) module. It illustrates how you can scale your upload speed using different S3UploadStreams instances. You can start them in a different process to scale to multiple cores or even on a different machine if you have an ultra fast shared storage.

Script specific parameters:

 `--file` - This is path to the file that you want to upload.

 `--destKey` - This is the key/path of amazon s3 destination object.
 
 `--partsPerUploader`- Number of chunks of data that each uploader instance will upload to s3. Used just for simple partitioning strategy between up loaders. You can use much more sophisticated strategies in the real world.

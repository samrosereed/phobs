import AWS from 'aws-sdk';
import { Meteor } from 'meteor/meteor';

AWS.config.update({
  accessKeyId: 'AKIAQKXP2WUSILC62T2D',
  secretAccessKey: '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',
  region: 'us-west-1',
});

const s3 = new AWS.S3();
// hacc23-photo-storage
Meteor.methods({
  async 'uploadFile'(fileContent, fileName, fileType) {
    const params = {
      Bucket: 'hacc23-photo-storage',
      Key: fileName,
      Body: Buffer.from(fileContent, 'base64'),
      ContentType: fileType,
      ACL: 'public-read',
    };
    try {
      const { Location } = await s3.upload(params).promise();
      return Location;
    } catch (err) {
      throw new Meteor.Error('s3.upload.fail', 'Upload to AWS S3 failed', err);
    }
  },
});
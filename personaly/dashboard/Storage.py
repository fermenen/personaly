import os
from google.cloud import storage


class StorageGoogle:
    """ Handles the upload to Google Storage """

    URL = "https://storage.cloud.google.com/{}/".format(os.getenv('BUCKET_ID'))

    def __init__(self, path):
        self.path = path
        self.storage = storage.Client.from_service_account_json('./personaly-app-0b6ae884ec46.json')
        self.bucket = self.storage.get_bucket(os.getenv('BUCKET_ID'))

    def upload(self, element):
        """Uploads a list of elements to google storage"""
        try:
            blob = self.bucket.blob(self.path)
            blob.upload_from_filename(element)
            return blob.public_url
        except Exception as exception:
            print('ERROR - Upload file to GCE - {}'.format(exception))

    def downloader(self, element):
        """Downloader a list of elements to google storage"""
        try:
            blob = self.bucket.blob(self.path)
            blob.download_to_filename(element)
        except Exception as exception:
            print('ERROR - Downloader file to GCE - {}'.format(exception))

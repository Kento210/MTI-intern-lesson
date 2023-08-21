import json
import boto3

# DynamoDBのクライアントを初期化
dynamodb = boto3.client('dynamodb')

def delete_article(event, context):
    # リクエストボディからJSONデータを取得
    body = json.loads(event['body'])
    
    # 必要なパラメータが存在するか確認
    if not all(key in body for key in ['userId', 'timestamp']):
        return {
            'statusCode': 400,
            'body': json.dumps({'message': 'Required parameters are missing.'})
        }

    user_id = body['userId']
    timestamp = body['timestamp']

    # DynamoDBから指定されたデータを削除
    dynamodb.delete_item(
        TableName='Article',
        Key={
            'userId': {'S': user_id},
            'timestamp': {'N': str(timestamp)}
        }
    )

    # 204 No Contentを返す
    return {
        'statusCode': 204
    }
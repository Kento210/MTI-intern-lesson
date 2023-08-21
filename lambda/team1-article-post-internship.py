import json
import time
import boto3

# DynamoDBのクライアントを初期化
dynamodb = boto3.client('dynamodb')

def post_article(event, context):
    # リクエストボディを取得
    body = json.loads(event['body'])

    # 必要なパラメータが存在するか確認
    if not all(key in body for key in ['userId', 'text']):
        return {
            'statusCode': 400,
            'body': json.dumps({'message': 'Required parameters are missing.'})
        }

    # パラメータを変数に格納
    user_id = body['userId']
    text = body['text']
    category = body.get('category', None)  # categoryはオプショナル

    # 現在のUNIXタイムスタンプをミリ秒単位で取得
    timestamp = int(time.time() * 1000)

    # DynamoDBにデータを登録
    item = {
        'userId': {'S': user_id},
        'timestamp': {'N': str(timestamp)},
        'text': {'S': text},
    }
    
    if category:
        item['category'] = {'S': category}

    dynamodb.put_item(
        TableName='Article',
        Item=item
    )

    # レスポンスを作成
    response = {
        'userId': user_id,
        'timestamp': timestamp,
        'text': text,
    }
    
    if category:
        response['category'] = category

    return {
        'statusCode': 200,
        'body': json.dumps(response)
    }


import json
import time

def post_article(event, context):
    # リクエストボディを取得
    body = json.loads(event['body'])

    # 必要なパラメータが存在するか確認
    if not all(key in body for key in ['userId', 'text', 'category']):
        return {
            'statusCode': 400,
            'body': json.dumps({'message': 'Required parameters are missing.'})
        }

    # パラメータを変数に格納
    user_id = body['userId']
    text = body['text']
    category = body['category']

    # 現在のUNIXタイムスタンプをミリ秒単位で取得
    timestamp = int(time.time() * 1000)

    # レスポンスを作成
    response = {
        'userId': user_id,
        'timestamp': timestamp,
        'text': text,
        'category': category
    }

    return {
        'statusCode': 200,
        'body': json.dumps(response)
    }

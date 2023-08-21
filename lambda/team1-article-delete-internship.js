// AWS SDK v3のDynamoDB関連のモジュールをインポート
const {
  DynamoDBClient,
  DeleteItemCommand,
} = require("@aws-sdk/client-dynamodb");
// DynamoDBのデータをJavaScriptオブジェクトから変換するためのユーティリティをインポート
const { marshall } = require("@aws-sdk/util-dynamodb");

// DynamoDBのクライアントを初期化。リージョンは "ap-northeast-1" に設定
const client = new DynamoDBClient({ region: "ap-northeast-1" });

// 使用するDynamoDBのテーブル名を定義
const TableName = "Article";

// Lambda関数のメインハンドラ
exports.handler = async (event, context) => {
  // デフォルトのレスポンスを設定
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*", // CORSの設定。すべてのオリジンからのアクセスを許可
    },
    body: JSON.stringify({ message: "" }),
  };

  // 認証のチェック。簡易的なトークン認証を実装
  if (event.headers.authorization !== "mtiToken") {
    response.statusCode = 401;
    response.body = JSON.stringify({
      message: "認証されていません。HeaderにTokenを指定してください",
    });

    return response;
  }

  // クエリパラメータからuserIdとtimestampを取得
  const userId = event.queryStringParameters?.userId;
  const timestamp = parseInt(event.queryStringParameters?.timestamp);

  // 必須のパラメータが存在するかチェック
  if (!userId || !timestamp) {
    response.statusCode = 400;
    response.body = JSON.stringify({
      message:
        "無効なリクエストです。query parameterに必須パラメータがセットされていません。",
    });

    return response;
  }

  // DynamoDBからのデータ削除のためのパラメータを設定
  const param = {
    TableName,
    Key: marshall({
      userId,
      timestamp,
    }),
  };

  // DeleteItemコマンドを作成
  const command = new DeleteItemCommand(param);

  try {
    // DynamoDBからデータを削除
    await client.send(command);
    response.statusCode = 204; // 成功した場合、204 No Contentを返す
  } catch (e) {
    // エラーが発生した場合の処理
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "予期せぬエラーが発生しました。",
      errorDetail: e.toString(),
    });
  }

  return response;
};

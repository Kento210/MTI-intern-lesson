const {
  DynamoDBClient,
  QueryCommand,
  ScanCommand,
} = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");
const client = new DynamoDBClient({ region: "ap-northeast-1" });
const TableName = "Article";

exports.handler = async (event, context) => {
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({ message: "" }),
  };

  if (event.headers.authorization !== "mtiToken") {
    return {
      statusCode: 401,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "認証されていません。HeaderにTokenを指定してください",
      }),
    };
  }

  const { hasValidQs, param } = createParam(event.queryStringParameters);

  const command = hasValidQs ? new QueryCommand(param) : new ScanCommand(param);
  
  try {
    const articles = (await client.send(command)).Items || [];
    const unmarshalledArticles = articles.map((item) => unmarshall(item));
    unmarshalledArticles.sort((a, b) => b.timestamp - a.timestamp);
    
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ articles: unmarshalledArticles }),
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "予期せぬエラーが発生しました。",
        errorDetail: e.toString(),
      }),
    };
  }
};

const createParam = (qs) => {
  const hasValidQs = qs?.userId;

  const param = {
    TableName,
    Limit: 100,
  };

  if (hasValidQs) {
    const { userId, start, end, category } = qs;
    const queryParam = {
      ...param,
      KeyConditionExpression: "userId = :uid and #ts BETWEEN :start AND :end",
      ExpressionAttributeNames: {
        "#ts": "timestamp",
      },
      ExpressionAttributeValues: {
        ":uid": userId,
        ":start": Number.isNaN(parseInt(start)) ? 0 : parseInt(start),
        ":end": Number.isNaN(parseInt(end)) ? Date.now() : parseInt(end),
      },
    };

    if (category) {
      queryParam.FilterExpression = "category = :category";
      queryParam.ExpressionAttributeValues[":category"] = category;
    }

    queryParam.ExpressionAttributeValues = marshall(queryParam.ExpressionAttributeValues);

    return {
      hasValidQs,
      param: queryParam,
    };
  }

  return { hasValidQs, param };
};

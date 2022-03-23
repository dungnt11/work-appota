## What is project?

This is the project in my job application email. 

## What technology is used in the project?

1. NodeJS (Express)
2. Possgres
3. Redis cache
4. Typescript
5. Multiple core nodeJS

## What have I done?

1. GET: api/products

    Lấy toàn bộ products sử dụng

    Filter product bằng query

    ```typescript
    export type queryFilter = {
      sortBy: string,
      orderBy: number, // 0: DESC | 1: ASC
      offset: number,
      limit: number,
      name: string,
    }
    ```

2. GET api/products/:idProduct

    Lấy chi tiết product theo ID

3. POST api/purchase

    Tình trạng mua hàng của user với transaction trong possgres
## What's API responsive?

Data chuẩn cho responsive như sau
```typescript
{
  c: {number}, // số lượng phần tử
  d: {data}, // data trả về
}
```

## How to start?

1. Run code

    Cài đặt docker và chạy lệnh sau
    ```bash
    docker-compose up
    ```

    Đợi cho các container hoàn thành. Lúc này bạn có thể test với các đầu API như sau

    > Docker có sử dụng `database-seed.sql` để tạo table và thêm dữ liệu giả

2. Dev

    Để phát triển ứng dụng thêm bạn sẽ chạy lệnh sau
    ```bash
    docker-compose down && docker-compose up --build
    ```

3. Test
    Chưa phát triển hết

## API done (Postman import)

1. Get all products

```CURL
curl --location --request GET 'http://localhost:3000/api/products'
```

2. Get detail product

```CURL
curl --location --request GET 'http://localhost:3000/api/products/1'
```

3. Purchase

```CURL
curl --location --request POST 'http://localhost:3000/api/purchase' \
--header 'Content-Type: application/json' \
--data-raw '{
    "idUser": 1,
    "idProduct": [1,2]
}'
```

## Test chịu tải app với 4 core ram 4

- 10000 reqs/s

![MarineGEO circle logo](/docs/test_request.png "10000reqs/s")

---

Còn vài đầu api tương tự chưa hoàn thành do em bận quá. Em xin chân thành cảm ơn!
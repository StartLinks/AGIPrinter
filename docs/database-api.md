# Database RESTful API

> 数据库 CRUD 操作接口文档

## 基础配置

| 配置项       | 值                 | 说明                    |
| ------------ | ------------------ | ----------------------- |
| **基础路径** | `/admin/database`  | API 根路径              |
| **认证方式** | Header Token       | 请求头添加 `token` 字段 |
| **数据格式** | `application/json` | 请求和响应格式          |

## URL 结构

```
token = FB1CAA48-C25E-4693-9BBC-A8C56540333B

baseUrl = https://fc-mp-b1a9bc8c-0aab-44ca-9af2-2bd604163a78.next.bspapp.com

{baseUrl}/admin/database/{collection}[/doc/{id}]
```

## HTTP 方法映射

| 方法     | 路径                     | 功能     |
| -------- | ------------------------ | -------- |
| `GET`    | `/{collection}`          | 查询列表 |
| `GET`    | `/{collection}/doc/{id}` | 查询单个 |
| `POST`   | `/{collection}`          | 创建文档 |
| `PATCH`  | `/{collection}/doc/{id}` | 更新文档 |
| `DELETE` | `/{collection}/doc/{id}` | 删除单个 |
| `DELETE` | `/{collection}`          | 批量删除 |

## API 接口说明

### 查询操作

#### 查询列表

```http
GET /admin/database/{collection}
```

**查询参数：**

- `limit`: 每页数量，默认 20
- `skip`: 跳过数量，默认 0
- `orderBy`: 排序字段
- `order`: 排序方向，`asc` 或 `desc`
- 其他字段: 作为筛选条件

**示例：**

```bash
curl -H "token: your-token" \
"https://api.example.com/admin/database/users?limit=10&status=active"
```

#### 查询单个

```http
GET /admin/database/{collection}/doc/{id}
```

**示例：**

```bash
curl -H "token: your-token" \
"https://api.example.com/admin/database/users/doc/60f1b2e4c8d4f20015a1b2c3"
```

### 创建操作

```http
POST /admin/database/{collection}
```

**请求体：**

```json
{
  "data": {
    "name": "张三",
    "email": "zhang@example.com"
  }
}
```

**示例：**

```bash
curl -X POST -H "token: your-token" -H "Content-Type: application/json" \
-d '{"data": {"name": "张三", "email": "zhang@example.com"}}' \
"https://api.example.com/admin/database/users"
```

### 更新操作

```http
PATCH /admin/database/{collection}/doc/{id}
```

**请求体：**

```json
{
  "data": {
    "status": "inactive"
  }
}
```

**示例：**

```bash
curl -X PATCH -H "token: your-token" -H "Content-Type: application/json" \
-d '{"data": {"status": "inactive"}}' \
"https://api.example.com/admin/database/users/doc/60f1b2e4c8d4f20015a1b2c3"
```

### 删除操作

#### 删除单个

```http
DELETE /admin/database/{collection}/doc/{id}
```

**示例：**

```bash
curl -X DELETE -H "token: your-token" \
"https://api.example.com/admin/database/users/doc/60f1b2e4c8d4f20015a1b2c3"
```

#### 批量删除

```http
DELETE /admin/database/{collection}
```

**请求体：**

```json
{
  "where": {
    "status": "inactive"
  }
}
```

**示例：**

```bash
curl -X DELETE -H "token: your-token" -H "Content-Type: application/json" \
-d '{"where": {"status": "inactive"}}' \
"https://api.example.com/admin/database/users"
```

## 响应格式

### 成功响应

```json
{
  "success": true,
  "data": {
    /* 数据内容 */
  },
  "message": "操作成功"
}
```

### 列表查询响应

```json
{
  "success": true,
  "data": [
    {
      /* 数据项 */
    }
  ],
  "pagination": {
    "total": 100,
    "limit": 20,
    "skip": 0,
    "page": 1,
    "totalPages": 5
  },
  "message": "查询成功"
}
```

### 错误响应

```json
{
  "success": false,
  "error": "错误信息",
  "message": "操作失败"
}
```

## JavaScript 使用示例

```javascript
// 基础配置
const API_BASE = "https://api.example.com/admin/database";
const TOKEN = "your-admin-token";

const headers = {
  "Content-Type": "application/json",
  token: TOKEN,
};

// 查询列表
async function getUsers(page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  const response = await fetch(
    `${API_BASE}/users?limit=${limit}&skip=${skip}`,
    { headers }
  );
  return response.json();
}

// 查询单个
async function getUser(id) {
  const response = await fetch(`${API_BASE}/users/doc/${id}`, { headers });
  return response.json();
}

// 创建
async function createUser(userData) {
  const response = await fetch(`${API_BASE}/users`, {
    method: "POST",
    headers,
    body: JSON.stringify({ data: userData }),
  });
  return response.json();
}

// 更新
async function updateUser(id, updates) {
  const response = await fetch(`${API_BASE}/users/doc/${id}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ data: updates }),
  });
  return response.json();
}

// 删除
async function deleteUser(id) {
  const response = await fetch(`${API_BASE}/users/doc/${id}`, {
    method: "DELETE",
    headers,
  });
  return response.json();
}
```

````

#### 1️⃣ 分页查询示例

```typescript
// 获取用户列表 - 第2页，每页20条，按创建时间降序
async function getUserList(page: number = 1, pageSize: number = 20) {
  try {
    const skip = (page - 1) * pageSize;
    const result = await apiRequest(
      `/users?limit=${pageSize}&skip=${skip}&orderBy=createTime&order=desc`
    );

    console.log("用户数据:", result.data);
    console.log("分页信息:", result.pagination);

    return result;
  } catch (error) {
    console.error("获取用户列表失败:", error.message);
    throw error;
  }
}

// 使用示例
getUserList(2, 20);
````

#### 2️⃣ 条件查询示例

```typescript
// 查询活跃用户
async function getActiveUsers(role?: string) {
  try {
    let endpoint = "/users?status=active&orderBy=lastLogin&order=desc";

    if (role) {
      endpoint += `&role=${encodeURIComponent(role)}`;
    }

    const result = await apiRequest(endpoint);
    return result.data;
  } catch (error) {
    console.error("查询活跃用户失败:", error.message);
    throw error;
  }
}

// 使用示例
const admins = await getActiveUsers("admin");
```

#### 3️⃣ 创建文档示例

```typescript
// 创建新用户
async function createUser(userData: {
  name: string;
  email: string;
  role?: string;
}) {
  try {
    const result = await apiRequest("/users", {
      method: "POST",
      body: JSON.stringify({
        data: {
          ...userData,
          status: "active",
          role: userData.role || "user",
        },
      }),
    });

    console.log("用户创建成功:", result.data);
    return result.data;
  } catch (error) {
    console.error("创建用户失败:", error.message);
    throw error;
  }
}

// 使用示例
const newUser = await createUser({
  name: "张三",
  email: "zhangsan@example.com",
  role: "admin",
});
```

#### 4️⃣ 更新文档示例

```typescript
// 更新用户信息（部分更新）
async function updateUser(
  userId: string,
  updates: Partial<{
    name: string;
    email: string;
    status: string;
    role: string;
  }>
) {
  try {
    const result = await apiRequest(`/users/doc/${userId}`, {
      method: "PATCH",
      body: JSON.stringify({ data: updates }),
    });

    console.log("用户更新成功");
    return result.data;
  } catch (error) {
    console.error("更新用户失败:", error.message);
    throw error;
  }
}

// 使用示例
await updateUser("60f1b2e4c8d4f20015a1b2c4", {
  status: "inactive",
  role: "user",
});
```

#### 5️⃣ 删除操作示例

```typescript
// 删除单个用户
async function deleteUser(userId: string) {
  try {
    const result = await apiRequest(`/users/doc/${userId}`, {
      method: "DELETE",
    });

    console.log("用户删除成功");
    return result.data;
  } catch (error) {
    console.error("删除用户失败:", error.message);
    throw error;
  }
}

// 批量删除非活跃用户
async function deleteInactiveUsers(beforeDate: string) {
  try {
    const result = await apiRequest("/users", {
      method: "DELETE",
      body: JSON.stringify({
        where: {
          status: "inactive",
          lastLogin: { $lt: beforeDate },
        },
      }),
    });

    console.log(`成功删除 ${result.data.deleted} 个非活跃用户`);
    return result.data;
  } catch (error) {
    console.error("批量删除失败:", error.message);
    throw error;
  }
}

// 使用示例
await deleteInactiveUsers("2025-01-01T00:00:00.000Z");
```

## 高级查询功能 🚀

### 智能类型解析

API 现在支持自动类型识别，无需手动转换：

```bash
# 数字类型自动识别
curl "https://api.example.com/admin/database/users?age=25&score=98.5"

# 布尔类型自动识别
curl "https://api.example.com/admin/database/users?is_active=true"

# null 值处理
curl "https://api.example.com/admin/database/users?avatar=null"
```

### 范围查询操作符

| 操作符 | 说明     | 示例                |
| ------ | -------- | ------------------- |
| `_gt`  | 大于     | `age_gt=18`         |
| `_gte` | 大于等于 | `age_gte=18`        |
| `_lt`  | 小于     | `age_lt=65`         |
| `_lte` | 小于等于 | `age_lte=65`        |
| `_ne`  | 不等于   | `status_ne=deleted` |

### 数组操作符

| 操作符 | 说明         | 示例                        |
| ------ | ------------ | --------------------------- |
| `_in`  | 包含任一值   | `status_in=active,pending`  |
| `_nin` | 不包含任一值 | `status_nin=deleted,banned` |

### 文本匹配操作符

| 操作符   | 说明                     | 示例                         |
| -------- | ------------------------ | ---------------------------- |
| `_like`  | 模糊匹配（不区分大小写） | `name_like=张`               |
| `_regex` | 正则表达式匹配           | `phone_regex=^1[3-9]\\d{9}$` |

### 字段存在性

| 操作符    | 说明           | 示例                 |
| --------- | -------------- | -------------------- |
| `_exists` | 字段存在性检查 | `avatar_exists=true` |

### 复合查询示例

```bash
# 查询18-65岁活跃用户
curl "https://api.example.com/admin/database/users?age_gte=18&age_lt=65&status=active"

# 查询特定角色用户
curl "https://api.example.com/admin/database/users?role_in=admin,editor,author"

# 模糊搜索用户名
curl "https://api.example.com/admin/database/users?name_like=张&status_ne=deleted"
```

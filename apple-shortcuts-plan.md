# Apple Shortcuts Plan

## Shortcuts

- Add a new resource
  - The request from the user should be a POST request with the following body:

    ```json
    method: POST,
    headers: {
      "Content-Type": "application/json",
    },
    body: {
      "resourceUrl": "https://example.com/some-resource",
      "title": "Example resource",
      "sourceUrl": "https://example.com/some-source
      "owner": "avi"
    }
    ```

  - Get the owner and resource data from the POST request

  ```TypeScript
  const body = await req.json() as Omit<Resource, 'id' | 'createdAt' | 'sourceImage'>;
  ```

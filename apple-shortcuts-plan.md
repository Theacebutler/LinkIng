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
      "sourceUrl": "https://example.com/some-source",
      "key": "key",
      "owner": "avi"
    }
    ```

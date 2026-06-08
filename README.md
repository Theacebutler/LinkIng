# Linking

Linking is a tool to gather and save resources from any website and save them
to a global collection you can easily access from anywhere, anytime.

[![Test](https://github.com/Theacebutler/LinkIng/actions/workflows/test.yml/badge.svg)](https://github.com/Theacebutler/LinkIng/actions/workflows/test.yml) [![Build and deploy](https://github.com/Theacebutler/LinkIng/actions/workflows/cd.yml/badge.svg)](https://github.com/Theacebutler/LinkIng/actions/workflows/cd.yml)

## Features

- Add resources from any website.
- View resources in a list.
- Blazing fast search.
- See a preview of the resource.
- Integrate with `curl` and Apple Shortcuts clients.
- Social login with Google and GitHub.

## Apple Screenshots integration

To add a resource with Apple Shortcuts, you can get a pre-built Apple Shortcut
[here](), or you can build your own.

The shortcut needs to make a POST request to the following endpoint:
`https://linkIng.acbutler.dev/api/resources/apple-shortcuts/`
with the following body:

```json
{
  "resourceUrl": "https://example.com/some-resource",
  "title": "Example resource",
  "sourceUrl": "https://example.com/some-source",
  "key": "key",
  "owner": "owner"
}
```

To get the `key` and `owner` for a user, you can make a GET request to the
following endpoint:
`https://linkIng.acbutler.dev/api/users/get-key/`
with the following headers:

```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <token>"
}
```

Or get it from the website.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to
discuss what you would like to change.

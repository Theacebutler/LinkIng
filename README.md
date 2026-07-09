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

To add a resource with Apple Shortcuts, you can build a shortcut that makes a
POST request to the following endpoint:

`https://linking.acbutler.dev/api/resources/apple-shortcuts`
with the following body:

```json
{
  "resourceUrl": "https://example.com/some-resource",
  "title": "Example resource", // optional
  "sourceUrl": "https://example.com/some-source", // optional
  "tags": "#tag1 #tag2", // optional
  "key": "key",
  "owner": "owner"
}
```

You get the `key` and `owner` from the [website](https://linking.acbutler.dev).

### Fetching resources via API key

To fetch all resources for a user using an API key, make a GET request to the
following endpoint:

`GET https://linking.acbutler.dev/api/resources/api-key?user=<owner>&key=<key>`

```json
// Response
[
  {
    "id": 1,
    "owner": "Bob",
    "title": "Prevent Attacks and Redirect Users with OAuth 2.0 State Parameters - Auth0 Docs",
    "resourceUrl": "https://auth0.com/docs/secure/attack-protection/state-parameters",
    "sourceUrl": "",
    "createdAt": "2026-07-07T15:44:09.931Z",
    "updatedAt": null,
    "tags": ["oauth"],
    "hasImage": 1
  }
]
```

You get the `key` and `owner` from the [website](https://linking.acbutler.dev),

## Contributing

Pull requests are welcome. For major changes, please open an issue first to
discuss what you would like to change.

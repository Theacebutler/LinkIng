group "default" {
  targets = ["api", "frontend"]
}

target "api" {
  context = "./api"
  dockerfile = "Dockerfile"
  tags = ["${LOWERCASE_GITHUB_REPOSITORY_OWNER}/linking-api:latest"]
  platforms = ["linux/amd64"]
  args = {
    GITHUB_REPOSITORY_OWNER = "${GITHUB_REPOSITORY_OWNER}"
  }
}

target "frontend" {
  context = "./frontend"
  dockerfile = "Dockerfile"
  tags = ["${LOWERCASE_GITHUB_REPOSITORY_OWNER}/linking-frontend:latest"]
  platforms = ["linux/amd64"]
  args = {
    GITHUB_REPOSITORY_OWNER = "${GITHUB_REPOSITORY_OWNER}"
  }
}

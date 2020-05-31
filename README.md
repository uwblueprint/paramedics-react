### Paramedics React App

To run the app in Docker containers (pretty much same as before)
```bash
# For dev
docker-compose -f "docker-compose-dev.yaml" up -d --build

# For prod
docker-compose -f "docker-compose-prod.yaml" up -d --build
```
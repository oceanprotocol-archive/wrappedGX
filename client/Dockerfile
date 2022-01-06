FROM node:16

COPY package*.json /usr/src/app/
WORKDIR /usr/src/app
RUN npm install 

COPY . /usr/src/app
ENV REACT_APP_WGX_ADDRESS=0xf26c6C93f9f1d725e149d95f8E7B2334a406aD10
ENV SKIP_PREFLIGHT_CHECK=true
EXPOSE 3000
ENTRYPOINT ["/usr/src/app/docker-entrypoint.sh"]

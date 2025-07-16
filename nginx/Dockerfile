FROM nginx:1.28.0-alpine3.21

# Changed nginx conf if needed later on
COPY default.conf /etc/nginx/conf.d/

# For basic static html usage
COPY ./htmltry/index.html /usr/share/nginx/html/index.html

CMD ["nginx", "-g", "daemon off;"]
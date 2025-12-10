FROM nginx:1.28.0-alpine3.21

COPY ./conf/nginx.conf /etc/nginx/nginx.conf
COPY ./conf/routes.conf /etc/nginx/conf.d/routes.conf
COPY ./conf/serv.template /etc/nginx/templates/serv.template

EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]
FROM postgres:11.3

ENV PG_MAJOR 11
ENV PG_FULL  11.3

RUN localedef -i pt_BR -c -f UTF-8 -A /usr/share/locale/locale.alias pt_BR.utf-8

RUN apt-get update && \
    apt-get install -y --no-install-recommends postgresql-$PG_MAJOR-pldebugger

ENV LANG pt_BR.utf8

ENV POSTGRES_USER=${DB_POSTGRES_USERNAME}
ENV POSTGRES_PASSWORD=${DB_POSTGRES_PASSWORD}

COPY ./conf/init-keycloak-db.sh /docker-entrypoint-initdb.d/

ENTRYPOINT [ "docker-entrypoint.sh", "postgres" ]

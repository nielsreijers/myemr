FROM mariadb:10.5.5

ARG USER_ID
ARG GROUP_ID

# See: https://jtreminio.com/blog/running-docker-containers-as-current-host-user/#ok-so-what-actually-works
RUN if [ ${USER_ID:-0} -ne 0 ] && [ ${GROUP_ID:-0} -ne 0 ]; then \
    echo replacing mysql user with one using user id ${USER_ID} &&\
    userdel -f mysql &&\
    if getent group mysql ; then groupdel mysql; fi &&\
    groupadd -g ${GROUP_ID} mysql &&\
    useradd -l -u ${USER_ID} -g mysql mysql &&\
    install -d -m 0755 -o mysql -g mysql /home/mysql &&\
    chown --changes --silent --no-dereference --recursive ${USER_ID}:${GROUP_ID} \
        /home/mysql \
        /var/lib/mysql \
        /var/run/mysqld \
;fi

USER mysql

ENV MYSQL_DATABASE=imagedescription
ENV MYSQL_ROOT_PASSWORD=1234

# Используем официальный образ Minio с quay.io
FROM minio/minio

# Создаем необходимые директории
RUN mkdir -p /data

# Устанавливаем переменные окружения
ENV MINIO_ROOT_USER=ROOTNAME
ENV MINIO_ROOT_PASSWORD=CHANGEME123
ENV accessKey=accessKey
ENV secretKey=secretKey

# Открываем порты
EXPOSE 9000 9001

# Запускаем Minio сервер
ENTRYPOINT ["minio", "server", "/data", "--console-address", ":9001"]

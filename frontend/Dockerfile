# Usar imagen ligera de Nginx para servir archivos estáticos
FROM nginx:alpine

# Copiar archivos del frontend al directorio de Nginx
COPY . /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

# Comando por defecto de nginx
CMD ["nginx", "-g", "daemon off;"]

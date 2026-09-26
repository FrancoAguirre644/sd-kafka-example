# Food Delivery - Seguimiento en tiempo real

Sistema distribuido de seguimiento de repartidores desarrollado como ejemplo práctico de integración de **Apache Kafka**, **NestJS**, **Python**, **WebSocket**, **Vue.js**, **TypeScript** y **Leaflet**.

El sistema simula la ubicación de un repartidor, publica los cambios mediante eventos en Kafka y los distribuye en tiempo real hacia una interfaz web.

---

## Arquitectura

```text
┌──────────────────────┐
│     NestJS Producer  │
│                      │
│ Simula ubicación     │
│ del repartidor       │
└──────────┬───────────┘
           │
           │ Kafka
           ▼
┌──────────────────────┐
│    Apache Kafka      │
│                      │
│ Topic:               │
│ delivery-events      │
└──────────┬───────────┘
           │
           │ Consumer
           ▼
┌─────────────────────────────┐
│ Python Consumer             │
│                             │
│ kafka-python                │
│ Flask                       │
│ Flask-SocketIO              │
└────────────┬────────────────┘
             │
             │ WebSocket
             ▼
┌─────────────────────────────┐
│ Vue 3 + TypeScript          │
│                             │
│ Seguimiento en tiempo real  │
│                             │
│ Leaflet + OpenStreetMap     │
└─────────────────────────────┘

          ┌───────────────┐
          │    Kafbat     │
          │               │
          │ Observabilidad│
          │ de Kafka      │
          └───────────────┘
```

---

## Tecnologías

### Backend / Productor

* [NestJS](https://nestjs.com/)
* TypeScript
* `@nestjs/microservices`
* Kafka
* KafkaJS

### Mensajería

* Apache Kafka
* Kafbat Kafka UI

### Consumer / WebSocket

* Python
* `kafka-python`
* Flask
* Flask-SocketIO

### Frontend

* Vue 3
* TypeScript
* Vite
* Tailwind CSS
* Socket.IO Client
* Leaflet
* OpenStreetMap

### Infraestructura

* Docker
* Docker Compose

---

## Estructura del proyecto

```text
food-delivery/
│
├── docker-compose.yml
│
├── producer/
│   ├── src/
│   │   ├── kafka/
│   │   │   ├── kafka.module.ts
│   │   │   └── kafka.service.ts
│   │   │
│   │   ├── delivery/
│   │   │   ├── dto/
│   │   │   │   └── update-location.dto.ts
│   │   │   ├── delivery.controller.ts
│   │   │   ├── delivery.module.ts
│   │   │   └── simulator.service.ts
│   │   │
│   │   ├── app.module.ts
│   │   └── main.ts
│   │
│   └── package.json
│
├── consumer/
│   ├── main.py
│   ├── requirements.txt
│   └── venv/
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── ConnectionStatus.vue
    │   │   ├── DeliveryHeader.vue
    │   │   ├── DeliveryInfo.vue
    │   │   └── DeliveryMap.vue
    │   │
    │   ├── types/
    │   │   └── delivery.ts
    │   │
    │   ├── App.vue
    │   ├── main.ts
    │   └── style.css
    │
    ├── vite.config.ts
    └── package.json
```

---

# Funcionamiento

El flujo principal de información es:

```text
1. Simulador NestJS
        │
        ▼
2. Evento UbicacionActualizada
        │
        ▼
3. Kafka - delivery-events
        │
        ▼
4. Consumer Python
        │
        ▼
5. Flask-SocketIO
        │
        ▼
6. WebSocket
        │
        ▼
7. Vue
        │
        ▼
8. Leaflet
```

Cada vez que el simulador genera una nueva posición, se publica un evento en Kafka.

El consumer Python recibe el evento y lo transmite mediante Socket.IO.

Finalmente, el frontend recibe el evento y actualiza la posición del repartidor en el mapa.

---

# Evento de ubicación

El sistema utiliza el evento:

```text
UbicacionActualizada
```

Ejemplo:

```json
{
  "tipo": "UbicacionActualizada",
  "repartidorId": 1,
  "pedidoId": 1001,
  "latitud": -34.6037,
  "longitud": -58.3816,
  "velocidad": 32,
  "estado": "EN_REPARTO"
}
```

### Campos

| Campo          | Descripción                  |
| -------------- | ---------------------------- |
| `tipo`         | Tipo de evento               |
| `repartidorId` | Identificador del repartidor |
| `pedidoId`     | Identificador del pedido     |
| `latitud`      | Latitud actual               |
| `longitud`     | Longitud actual              |
| `velocidad`    | Velocidad actual en km/h     |
| `estado`       | Estado actual del pedido     |

---

# Apache Kafka

Kafka funciona como el sistema de mensajería que desacopla al productor del consumidor.

El topic utilizado es:

```text
delivery-events
```

Actualmente el proyecto utiliza:

```text
Partitions: 1
Replication factor: 1
```

La configuración está pensada para un entorno local de aprendizaje.

---

# Docker

El archivo `docker-compose.yml` levanta los servicios necesarios para Kafka.

Servicios:

```text
kafka
kafbat
```

### Kafka

Kafka utiliza tres listeners:

```text
CONTROLLER
INTERNAL
EXTERNAL
```

La configuración permite que diferentes clientes se conecten dependiendo de dónde se encuentren:

```text
NestJS
   │
   │ localhost:9092
   ▼
Kafka

Kafbat
   │
   │ kafka:9094
   ▼
Kafka
```

---

# Iniciar Kafka

Desde la raíz del proyecto:

```bash
docker compose up -d
```

Verificar los contenedores:

```bash
docker compose ps
```

Deberían estar disponibles:

```text
food-delivery-kafka
food-delivery-kafbat
```

---

# Kafbat

Kafbat permite visualizar el estado del cluster Kafka, los topics y los mensajes.

Acceder desde:

```text
http://localhost:8080
```

Cluster configurado:

```text
food-delivery
```

Bootstrap Server:

```text
kafka:9094
```

---

# Producer - NestJS

El producer es responsable de generar los eventos de ubicación.

## Instalación

Ingresar al directorio:

```bash
cd producer
```

Instalar dependencias:

```bash
npm install
```

---

## Ejecutar

```bash
npm run start:dev
```

El servidor NestJS queda disponible en:

```text
http://localhost:3000
```

---

# Simulador

El proyecto incluye un simulador de repartidor.

El simulador genera periódicamente diferentes posiciones:

```text
Posición 1
    ↓
Posición 2
    ↓
Posición 3
    ↓
Posición 4
    ↓
...
```

Cada posición contiene una velocidad diferente.

Ejemplo:

```text
18 km/h
24 km/h
31 km/h
38 km/h
42 km/h
35 km/h
27 km/h
19 km/h
23 km/h
32 km/h
```

Esto permite observar cómo cambian los datos mostrados en la interfaz.

Actualmente el simulador publica una nueva ubicación cada:

```text
2 segundos
```

---

# API REST

El producer también expone un endpoint para publicar manualmente una ubicación:

```http
POST /delivery/location
```

Ejemplo:

```json
{
  "repartidorId": 1,
  "pedidoId": 1001,
  "latitud": -34.6037,
  "longitud": -58.3816,
  "velocidad": 32,
  "estado": "EN_REPARTO"
}
```

El endpoint transforma la información en un evento:

```json
{
  "tipo": "UbicacionActualizada",
  "repartidorId": 1,
  "pedidoId": 1001,
  "latitud": -34.6037,
  "longitud": -58.3816,
  "velocidad": 32,
  "estado": "EN_REPARTO"
}
```

y lo publica en:

```text
delivery-events
```

---

# Consumer - Python

El consumer se encarga de leer los eventos publicados en Kafka.

Ingresar al directorio:

```bash
cd consumer
```

Crear el entorno virtual:

```bash
python -m venv venv
```

Activarlo en Windows:

```powershell
venv\Scripts\activate
```

Instalar dependencias:

```bash
pip install -r requirements.txt
```

---

## Ejecutar

```bash
python main.py
```

El servidor queda disponible en:

```text
http://localhost:8765
```

El endpoint principal:

```text
GET /
```

devuelve:

```json
{
  "message": "Delivery WebSocket Server"
}
```

---

# WebSocket

El consumer utiliza Flask-SocketIO para transmitir los eventos recibidos desde Kafka.

Cuando recibe:

```text
UbicacionActualizada
```

emite:

```text
delivery-location
```

El frontend escucha este evento:

```typescript
socket.on(
  'delivery-location',
  (event) => {
    // actualizar interfaz
  },
)
```

De esta manera, el frontend no necesita consultar periódicamente al backend.

---

# Frontend

El frontend está desarrollado con:

* Vue 3
* TypeScript
* Vite
* Tailwind CSS
* Leaflet
* Socket.IO Client

Ingresar:

```bash
cd frontend
```

Instalar dependencias:

```bash
npm install
```

Ejecutar:

```bash
npm run dev
```

Vite mostrará la URL correspondiente, normalmente:

```text
http://localhost:5173
```

---

# Interfaz

La interfaz permite visualizar:

* Estado de conexión con el servidor.
* Número de pedido.
* Identificador del repartidor.
* Velocidad actual.
* Estado del pedido.
* Coordenadas actuales.
* Ubicación del repartidor sobre el mapa.
* Actualización en tiempo real.

El mapa utiliza:

```text
Leaflet
```

con mapas de:

```text
OpenStreetMap
```

El marcador se actualiza directamente a la nueva posición recibida, sin realizar una animación de traslado entre coordenadas.

---

# Ejecutar todo el sistema

Para ejecutar el proyecto completo:

### 1. Kafka y Kafbat

Desde la raíz:

```bash
docker compose up -d
```

### 2. Consumer

```bash
cd consumer
venv\Scripts\activate
python main.py
```

### 3. Producer

En otra terminal:

```bash
cd producer
npm run start:dev
```

### 4. Frontend

En otra terminal:

```bash
cd frontend
npm run dev
```

Finalmente acceder a:

```text
http://localhost:5173
```

---

# Verificar Kafka manualmente

También es posible verificar los mensajes directamente desde Kafka.

### Producer de consola

```bash
docker exec -it food-delivery-kafka \
  /opt/kafka/bin/kafka-console-producer.sh \
  --topic delivery-events \
  --bootstrap-server localhost:9092
```

Ingresar un evento:

```json
{"tipo":"UbicacionActualizada","repartidorId":1,"pedidoId":1001,"latitud":-34.6037,"longitud":-58.3816,"velocidad":32,"estado":"EN_REPARTO"}
```

### Consumer de consola

En otra terminal:

```bash
docker exec -it food-delivery-kafka \
  /opt/kafka/bin/kafka-console-consumer.sh \
  --topic delivery-events \
  --bootstrap-server localhost:9092 \
  --from-beginning
```

Esto permite comprobar que Kafka está recibiendo y almacenando los eventos.

---

# Comunicación entre componentes

## Producer → Kafka

NestJS publica:

```text
delivery-events
```

utilizando Kafka.

```text
NestJS
   │
   │ publish()
   ▼
Kafka
```

## Kafka → Consumer

Python consume:

```text
delivery-events
```

```text
Kafka
   │
   │ consume
   ▼
Python
```

## Consumer → Frontend

Python recibe el evento y lo transmite:

```text
Python
   │
   │ Socket.IO
   ▼
Vue
```

---

# Ventajas de la arquitectura

La arquitectura permite desacoplar los distintos componentes.

El productor no necesita conocer quién consume los eventos.

```text
Producer
   │
   ▼
 Kafka
   │
   ├── Consumer 1
   ├── Consumer 2
   └── Consumer 3
```

Esto permite incorporar nuevos consumidores sin modificar el productor.

Por ejemplo, en una evolución del sistema podrían existir:

```text
Kafka
 ├── Seguimiento web
 ├── Notificaciones
 ├── Registro histórico
 └── Analítica
```

---

# Flujo completo de un evento

Un evento generado por el simulador sigue el siguiente recorrido:

```text
┌─────────────────────┐
│ Simulador NestJS    │
└──────────┬──────────┘
           │
           │ UbicacionActualizada
           ▼
┌─────────────────────┐
│ Apache Kafka        │
│ delivery-events     │
└──────────┬──────────┘
           │
           │ consume
           ▼
┌─────────────────────┐
│ Python Consumer     │
└──────────┬──────────┘
           │
           │ Socket.IO
           ▼
┌─────────────────────┐
│ Vue + TypeScript    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Leaflet             │
│                     │
│ 📍 Repartidor       │
└─────────────────────┘
```

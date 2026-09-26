import json
import threading

from flask import Flask
from flask_socketio import SocketIO
from kafka import KafkaConsumer


KAFKA_TOPIC = "delivery-events"
KAFKA_BOOTSTRAP_SERVERS = "localhost:9092"

FLASK_HOST = "localhost"
FLASK_PORT = 8765


app = Flask(__name__)

socketio = SocketIO(
    app,
    cors_allowed_origins="*",
)


consumer = KafkaConsumer(
    KAFKA_TOPIC,
    bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
    group_id="delivery-consumer",
    auto_offset_reset="earliest",
    value_deserializer=lambda value: json.loads(
        value.decode("utf-8")
    ),
)


@app.route("/")
def index():
    return {
        "message": "Delivery WebSocket Server"
    }


def consume_kafka():
    print("Kafka Consumer iniciado")
    print("Esperando eventos...")

    for message in consumer:
        event = message.value

        print("Evento recibido:")
        print(event)

        socketio.emit(
            "delivery-location",
            event,
        )


if __name__ == "__main__":

    kafka_thread = threading.Thread(
        target=consume_kafka,
        daemon=True,
    )

    kafka_thread.start()

    print(
        f"Servidor Flask escuchando en "
        f"http://{FLASK_HOST}:{FLASK_PORT}"
    )

    socketio.run(
        app,
        host=FLASK_HOST,
        port=FLASK_PORT,
    )
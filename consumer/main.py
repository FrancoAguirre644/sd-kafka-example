import json

from kafka import KafkaConsumer


consumer = KafkaConsumer(
    "delivery-events",
    bootstrap_servers="localhost:9092",
    group_id="delivery-consumer",
    auto_offset_reset="earliest",
    value_deserializer=lambda value: json.loads(value.decode("utf-8")),
)


print("Consumer Kafka iniciado")
print("Esperando eventos...")


for message in consumer:
    event = message.value

    print("Evento recibido:")
    print(event)
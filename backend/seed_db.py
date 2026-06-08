import database as db
import time

def seed():
    max_retries = 10
    for i in range(max_retries):
        try:
            # Forzar recreación de tablas (migración)
            db.Base.metadata.drop_all(bind=db.engine)
            db.init_db()
            session = db.SessionLocal()
            print("Conexión establecida para seeding.")
            
            # Limpiar datos previos
            session.query(db.Product).delete()
            session.query(db.User).delete()

            # Productos
            productos = [
                {
                    "name": "Ratatouille Clásica",
                    "description": "Verduras provenzales confitadas al horno lento con hierbas de la región y aceite de oliva virgen extra.",
                    "price": 35000.0,
                    "category": "entrada",
                    "image_path": "/static/uploads/products/producto_01.webp"
                },
                {
                    "name": "Soupe à l'Oignon",
                    "description": "Sopa de cebolla caramelizada con caldo de res artesanal, gratinada con gruyère y croûtons.",
                    "price": 28000.0,
                    "category": "entrada",
                    "image_path": "/static/uploads/products/producto_02.webp"
                },
                {
                    "name": "Foie Gras Poêlé",
                    "description": "Hígado de pato sellado, reducción de Sauternes, brioche tostado y confit de cebollas caramelizadas.",
                    "price": 58000.0,
                    "category": "entrada",
                    "image_path": "/static/uploads/products/producto_03.webp"
                },
                {
                    "name": "Boeuf Bourguignon",
                    "description": "Ternera estofada en vino tinto de Borgoña, champiñones, zanahorias glaseadas y papas torneadas.",
                    "price": 68000.0,
                    "category": "principal",
                    "image_path": "/static/uploads/products/producto_04.webp"
                },
                {
                    "name": "Confit de Canard",
                    "description": "Muslo de pato confitado 8 horas, piel crujiente, papas sarladaises y salsa de cerezas amargas.",
                    "price": 72000.0,
                    "category": "principal",
                    "image_path": "/static/uploads/products/producto_05.webp"
                },
                {
                    "name": "Bouillabaisse Marseillaise",
                    "description": "Guiso de mariscos y pescados frescos del día, rouille provenzal y pan de campo tostado.",
                    "price": 85000.0,
                    "category": "principal",
                    "image_path": "/static/uploads/products/producto_06.webp"
                },
                {
                    "name": "Crème Brûlée",
                    "description": "Crema de vainilla de Madagascar, costra de azúcar caramelizado a soplete, frutos rojos frescos.",
                    "price": 22000.0,
                    "category": "postre",
                    "image_path": "/static/uploads/products/producto_07.webp"
                },
                {
                    "name": "Tarte Tatin",
                    "description": "Tarta invertida de manzanas caramelizadas, masa hojaldrada artesanal y helado de crème fraîche.",
                    "price": 18000.0,
                    "category": "postre",
                    "image_path": "/static/uploads/products/producto_08.webp"
                },
                {
                    "name": "Vin Rouge Maison",
                    "description": "Selección del sommelier. Bouquet afrutado, taninos equilibrados y final largo y persistente.",
                    "price": 32000.0,
                    "category": "bebida",
                    "image_path": "/static/uploads/products/producto_09.webp"
                }
            ]

            for p in productos:
                product = db.Product(**p)
                session.add(product)

            # Usuarios con roles (Lineamiento 3A.1)
            usuarios = [
                {
                    "username": "superadmin",
                    "email": "superadmin@ratatouille.com.py",
                    "password_hash": "1234",
                    "role": "superadmin",
                    "name": "Super Administrador"
                },
                {
                    "username": "admin",
                    "email": "admin@ratatouille.com.py",
                    "password_hash": "1234",
                    "role": "admin",
                    "name": "Administrador"
                },
                {
                    "username": "operador",
                    "email": "operador@ratatouille.com.py",
                    "password_hash": "1234",
                    "role": "operador",
                    "name": "Operador"
                }
            ]

            for u in usuarios:
                user = db.User(**u)
                session.add(user)

            session.commit()
            print("Base de datos poblada con éxito.")
            session.close()
            return # Éxito
        except Exception as e:
            print(f"Error en seeding (intento {i+1}/{max_retries}): {e}")
            time.sleep(2)

if __name__ == "__main__":
    seed()

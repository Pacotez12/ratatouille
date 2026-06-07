import database as db
import time

def seed():
    max_retries = 10
    for i in range(max_retries):
        try:
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
                    "image_path": "https://images.unsplash.com/photo-1572453800999-e8d2d1589b7c?w=640&h=420&fit=crop&auto=format&q=80"
                },
                {
                    "name": "Soupe à l'Oignon",
                    "description": "Sopa de cebolla caramelizada con caldo de res artesanal, gratinada con gruyère y croûtons.",
                    "price": 28000.0,
                    "category": "entrada",
                    "image_path": "https://images.unsplash.com/photo-1547592180-85f173990554?w=640&h=420&fit=crop&auto=format&q=80"
                },
                {
                    "name": "Foie Gras Poêlé",
                    "description": "Hígado de pato sellado, reducción de Sauternes, brioche tostado y confit de cebollas caramelizadas.",
                    "price": 58000.0,
                    "category": "entrada",
                    "image_path": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=640&h=420&fit=crop&auto=format&q=80"
                },
                {
                    "name": "Boeuf Bourguignon",
                    "description": "Ternera estofada en vino tinto de Borgoña, champiñones, zanahorias glaseadas y papas torneadas.",
                    "price": 68000.0,
                    "category": "principal",
                    "image_path": "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=640&h=420&fit=crop&auto=format&q=80"
                },
                {
                    "name": "Confit de Canard",
                    "description": "Muslo de pato confitado 8 horas, piel crujiente, papas sarladaises y salsa de cerezas amargas.",
                    "price": 72000.0,
                    "category": "principal",
                    "image_path": "https://i.ytimg.com/vi/QyfjfsYGrWI/maxresdefault.jpg"
                },
                {
                    "name": "Bouillabaisse Marseillaise",
                    "description": "Guiso de mariscos y pescados frescos del día, rouille provenzal y pan de campo tostado.",
                    "price": 85000.0,
                    "category": "principal",
                    "image_path": "https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=640&h=420&fit=crop&auto=format&q=80"
                },
                {
                    "name": "Crème Brûlée",
                    "description": "Crema de vainilla de Madagascar, costra de azúcar caramelizado a soplete, frutos rojos frescos.",
                    "price": 22000.0,
                    "category": "postre",
                    "image_path": "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=640&h=420&fit=crop&auto=format&q=80"
                },
                {
                    "name": "Tarte Tatin",
                    "description": "Tarta invertida de manzanas caramelizadas, masa hojaldrada artesanal y helado de crème fraîche.",
                    "price": 18000.0,
                    "category": "postre",
                    "image_path": "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=640&h=420&fit=crop&auto=format&q=80"
                },
                {
                    "name": "Vin Rouge Maison",
                    "description": "Selección del sommelier. Bouquet afrutado, taninos equilibrados y final largo y persistente.",
                    "price": 32000.0,
                    "category": "bebida",
                    "image_path": "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=640&h=420&fit=crop&auto=format&q=80"
                }
            ]

            for p in productos:
                product = db.Product(**p)
                session.add(product)

            # Usuario Admin
            admin = db.User(
                username="admin",
                email="admin@ratatouille.com.py",
                password_hash="password",
                role="administrador"
            )
            session.add(admin)

            session.commit()
            print("Base de datos poblada con éxito.")
            session.close()
            return # Éxito
        except Exception as e:
            print(f"Error en seeding (intento {i+1}/{max_retries}): {e}")
            time.sleep(2)

if __name__ == "__main__":
    seed()

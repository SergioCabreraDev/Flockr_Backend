## Initial DB

-- 📌 Tabla de Usuarios
CREATE TABLE users (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
username VARCHAR(32) UNIQUE NOT NULL,
email VARCHAR(100) UNIQUE NOT NULL,
password_hash TEXT NOT NULL,
avatar_url TEXT,
created_at TIMESTAMP DEFAULT NOW()
);

-- 📌 Tabla de Servidores (Grupos)
CREATE TABLE servers (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
name VARCHAR(100) NOT NULL,
owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
created_at TIMESTAMP DEFAULT NOW()
);

-- 📌 Relación entre Usuarios y Servidores (Miembros)
CREATE TABLE server_members (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
user_id UUID REFERENCES users(id) ON DELETE CASCADE,
server_id UUID REFERENCES servers(id) ON DELETE CASCADE,
role VARCHAR(50) DEFAULT 'member' -- Ej: admin, moderator, member
);

-- 📌 Tabla de Canales dentro de un Servidor
CREATE TABLE channels (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
server_id UUID REFERENCES servers(id) ON DELETE CASCADE,
name VARCHAR(100) NOT NULL,
type VARCHAR(10) CHECK (type IN ('text', 'voice')) NOT NULL,
created_at TIMESTAMP DEFAULT NOW()
);

-- 📌 Mensajes en los canales
CREATE TABLE channel_messages (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
user_id UUID REFERENCES users(id) ON DELETE SET NULL,
content TEXT NOT NULL,
created_at TIMESTAMP DEFAULT NOW()
);

-- 📌 Mensajes privados entre usuarios
CREATE TABLE direct_messages (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
receiver_id UUID REFERENCES users(id) ON DELETE CASCADE,
content TEXT NOT NULL,
created_at TIMESTAMP DEFAULT NOW()
);

-- 📌 Tabla de Amigos (Solicitudes y Bloqueos)
CREATE TABLE friendships (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
user1_id UUID REFERENCES users(id) ON DELETE CASCADE,
user2_id UUID REFERENCES users(id) ON DELETE CASCADE,
status VARCHAR(10) CHECK (status IN ('pending', 'accepted', 'blocked')) NOT NULL,
created_at TIMESTAMP DEFAULT NOW()
);

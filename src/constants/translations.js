export const translations = {
    es: {
        settings: {
            title: "Configuración",
            general: "GENERAL",
            language: "Idioma",
            darkMode: "Modo Oscuro",
            security: "SEGURIDAD",
            logout: "Cerrar Sesión",
            notification: "Notificaciones",
            changePassword: "Cambiar Contraseña",
            editProfile: "Editar Perfil",
            twoStep: "Verificación en 2 pasos",
            helpCenter: "Centro de Ayuda",
            terms: "Términos y Privacidad",
            deleteAccount: "Eliminar Cuenta",
            help: "AYUDA & LEGAL",
            center: "Centro de ayuda"

        },
        ai: {
            title: "Planet Bot",
            subtitle: "Asistente Planetario",
            welcome: "¡Hola! Soy Planet Bot 🌿. Estoy aquí para ayudarte a reciclar mejor. Selecciona una pregunta de arriba o escribe la tuya.",
            suggested: "Preguntas frecuentes:",
            placeholder: "Escribe tu duda sobre reciclaje...",
            typing: "Planet Bot está escribiendo...",
            error: "❌ Lo siento, Planet Bot tuvo un problema. Intenta de nuevo.",
            tips: [
                "💡 ¿Sabías que? Una botella de plástico tarda 500 años en degradarse.",
                "🌿 ¡Reciclar 1 tonelada de papel salva 17 árboles!",
                "🧴 Recuerda lavar y aplastar tus botellas antes de reciclarlas.",
                "🔋 Las pilas nunca van a la basura común, ¡son tóxicas!",
                "🔄 La economía circular ayuda a reducir residuos.",
                "🌍 Pequeñas acciones generan grandes cambios."
            ]
        },
        password: {
            description: "Crea una contraseña segura de al menos 8 caracteres",
            currentLabel: "Contraseña Actual",
            currentPlaceholder: "Ingresa tu contraseña actual",
            newLabel: "Nueva Contraseña",
            newPlaceholder: "Ingresa tu nueva contraseña",
            confirmLabel: "Confirmar Nueva Contraseña",
            confirmPlaceholder: "Confirma tu nueva contraseña",
            reqTitle: "La contraseña debe contener:",
            reqChars: "Al menos 8 caracteres",
            reqUpper: "Una letra mayúscula",
            reqNumber: "Un número",
            reqMatch: "Las contraseñas coinciden",
            btnChange: "Cambiar Contraseña",
            modalConfirmTitle: "¿Cambiar Contraseña?",
            modalConfirmMsg: "¿Estás seguro? Esta acción actualizará tu método de acceso.",
            modalSuccessTitle: "¡Contraseña Cambiada!",
            modalSuccessMsg: "Tu contraseña se ha actualizado correctamente.",
            btnConfirm: "Sí, Cambiar",
            btnCancel: "Cancelar",
            btnOk: "Entendido"
        },
        drawer: {
            points: "puntos",
            logout: "Cerrar Sesión",
            sections: {
                main: "Principal",
                explore: "Explorar",
                account: "Cuenta"
            },
            items: {
                home: "Inicio",
                assistant: "Asistente Virtual",
                rank: "EcoPuntos",
                footprint: "Tu huella verde",
                profile: "Mi perfil",
                donations: "Donaciones",
                partners: "Convenios",
                programs: "Programas Ambientales",
                induction: "Inducción",
                forum: "Foro",
                about: "Acerca de Nos Planét",
                settings: "Configuración"
            }
        },
        logoutModal: {
            title: "Cerrar Sesión",
            message: "¿Estás seguro que deseas cerrar sesión?",
            cancel: "Cancelar",
            confirm: "Cerrar Sesión"
        },
        terms: {
            title: "Términos y Privacidad",
            tabs: { use: "Términos de Uso", privacy: "Privacidad" },
            lastUpdate: "Última actualización: 5 de marzo de 2026",
            contactSubject: "Consulta Legal - Nos Planét",
            // Secciones de Términos
            useSections: [
                {
                    title: "1. Aceptación de los Términos",
                    text: "Al acceder y utilizar la aplicación Nos Planét ('la App'), usted acepta estar sujeto a estos Términos y Condiciones. Si no está de acuerdo con estos términos, por favor no utilice la aplicación."
                },
                {
                    title: "2. Uso de la Aplicación",
                    text: "La App proporciona una plataforma para promover el reciclaje y la sostenibilidad ambiental. Los usuarios pueden acumular EcoPuntos por sus actividades de reciclaje verificadas y canjearlos por recompensas disponibles en nuestro catálogo."
                },
                {
                    title: "3. Cuenta de Usuario",
                    text: "Usted es responsable de proporcionar información verídica al registrarse. Debe mantener la seguridad de su contraseña y es el único responsable de las actividades realizadas en su cuenta. El uso de la cuenta es personal e intransferible."
                },
                {
                    title: "4. Sistema de EcoPuntos",
                    text: "Los EcoPuntos son una unidad de medida interna para incentivar el reciclaje y no tienen valor monetario real. Nos reservamos el derecho de modificar las tasas de acumulación y el catálogo de premios según disponibilidad."
                },
                {
                    title: "5. Conducta Prohibida",
                    text: "No está permitido manipular el sistema de pesaje, proporcionar fotos falsas de reciclaje, acosar a otros usuarios o utilizar la App para fines comerciales no autorizados."
                }
            ],
            // Secciones de Privacidad
            privacySections: [
                {
                    title: "1. Información Recopilada",
                    text: "Recopilamos su nombre, correo electrónico, número de teléfono y datos sobre su actividad de reciclaje (materiales, peso y frecuencia) para gestionar su cuenta y el impacto ambiental."
                },
                {
                    title: "2. Uso de Datos",
                    text: "Sus datos se utilizan exclusivamente para validar sus EcoPuntos, personalizar su experiencia en la App, procesar el canje de premios y enviarle actualizaciones sobre el servicio."
                },
                {
                    title: "3. Protección de Información",
                    text: "Implementamos medidas de seguridad técnicas como encriptación SSL y bases de datos seguras para proteger su información personal contra accesos no autorizados."
                },
                {
                    title: "4. Sus Derechos (ARCO)",
                    text: "Usted tiene derecho a Acceder, Rectificar, Cancelar u Oponerse al tratamiento de sus datos. Puede solicitar la eliminación definitiva de su cuenta desde la sección de configuración."
                }
            ]
        },
        footprint: {
            header: {
                title: "Tu Huella Verde",
                subtitle: "Mira lo que has logrado"
            },
            planetStatus: {
                gray: { status: "Mundo Gris", message: "Tu planeta necesita ayuda. ¡Empieza a reciclar!" },
                recovering: { status: "Recuperándose", message: "¡El aire se siente más limpio gracias a ti!" },
                radiant: { status: "Mundo Radiante", message: "¡Eres un héroe ambiental! Tu mundo brilla." }
            },
            co2Card: "Huella de Carbono Reducida",
            equivalencies: {
                title: "Equivalencias Reales",
                subtitle: "Para que dimensiones tu impacto:",
                energy: "Ahorraste energía para <bold>{{hours}} horas</bold> de un foco o <bold>{{charges}} cargas</bold> de celular.",
                water: "Evitaste el uso de agua equivalente a <bold>{{showers}} duchas rápidas</bold>.",
                transport: "Evitaste emisiones iguales a un viaje de <bold>{{km}} km</bold> en auto.",
                trees: "Has salvado el equivalente a <bold>{{trees}} árboles</bold> adultos."
            },
            share: {
                button: "Presumir mi Logro",
                subtitle: "Inspirar a otros a reciclar",
                message: "🌿 Este mes mi Huella Verde salvó el equivalente a {{trees}} árboles en la app Nos Planét. ¿Y tú qué hiciste por el planeta? 🌎 #Reciclaje #NosPlanét"
            }
        },
        support: {
            title: "Centro de Ayuda",
            contact: {
                whatsapp: "WhatsApp",
                email: "Correo electrónico"
            },
            sections: {
                topics: "Temas de Ayuda",
                faqs: "Preguntas Frecuentes",
                moreHelp: "¿Necesitas más ayuda?"
            },
            topics: {
                recycle: { title: "¿Cómo reciclar?", desc: "Aprende los pasos para reciclar correctamente" },
                points: { title: "¿Cómo ganar puntos?", desc: "Descubre todas las formas de acumular EcoPuntos" },
                rewards: { title: "Canjear premios", desc: "Guía para canjear tus puntos por recompensas" },
                contact: { title: "Contactar soporte", desc: "Envíanos un mensaje directamente", subject: "Solicitud de Ayuda" }
            },
            faqs: [
                { q: "¿Cómo verifico mi cuenta?", a: "Para verificar tu cuenta, ve a Configuración > Perfil y sigue los pasos de verificación. Necesitarás un documento de identidad válido." },
                { q: "¿Cuándo aparecen mis puntos?", a: "Los puntos aparecen inmediatamente después de registrar tu actividad. Si no los ves en 24h, contáctanos." },
                { q: "¿Puedo transferir mis puntos?", a: "No, los EcoPuntos son personales e intransferibles para mantener la integridad del programa." },
                { q: "¿Los premios vencen?", a: "Sí, algunos premios tienen fecha de vencimiento. Revisa los términos antes de canjear." }
            ],
            modals: {
                gotIt: "Entendido",
                close: "Cerrar",
                recycle: {
                    title: "¿Cómo Reciclar?",
                    steps: [
                        { t: "Separa tus residuos", d: "Clasifica materiales: papel, cartón, plástico, vidrio y metal." },
                        { t: "Limpia los materiales", d: "Asegúrate de que los envases estén limpios y secos." },
                        { t: "Solicita recolección", d: "Usa la app para solicitar el recojo de tus materiales." },
                        { t: "Gana EcoPuntos", d: "Por cada kilo acumulado obtienes puntos para canjear." }
                    ]
                },
                points: {
                    title: "¿Cómo Ganar Puntos?",
                    cards: [
                        { t: "Reciclando", p: "50-200 pts/kg", d: "Puntos por cada kilo de material." },
                        { t: "Invita amigos", p: "100 pts por invitado", d: "Gana cuando tus amigos realicen su primer reciclaje." },
                        { t: "Logros", p: "50-500 pts", d: "Completa retos semanales." }
                    ]
                },
                rewards: {
                    title: "Canjear Premios",
                    desc: "Sigue estos pasos para obtener recompensas:",
                    steps: ["Ve a Recompensas", "Elige tu premio", "Confirma el canje", "Recibe tu premio"],
                    tip: "Verifica los términos antes de canjear.",
                    induction: { title: "¿Quieres saber más?", sub: "Completa la Inducción Interactiva" }
                }
            }
        },

        editProfile: {
            title: "Editar Perfil",
            changePhoto: "Cambiar Foto",
            fullName: "Nombre Completo",
            phone: "Número de Celular",
            save: "Guardar Cambios",
            placeholders: {
                name: "Ingresa tu nombre completo",
                phone: "Ingresa tu número de celular"
            },
            alerts: {
                permission: "Permiso necesario",
                gallery: "Necesitamos acceso a tu galería.",
                nameReq: "El nombre es obligatorio",
                success: "¡Perfil actualizado con éxito!",
                error: "No se pudo actualizar el perfil. Intenta de nuevo."
            }
        },
        profile: {
            title: "Perfil",
            ecoCitizen: "Ciudadano Eco",
            recycled: "Reciclado",
            water: "Agua",
            userType: "Ciudadano Eco",
            stats: {
                recycled: "Reciclado",
                water: "Agua",
                achievements: "Logros"
            },
            sections: {
                security: "Cuenta y Seguridad",
                community: "Comunidad"
            },
            menu: {
                personalData: "Datos Personales",
                history: "Historial",
                invite: "Invitar Amigos",
                settings: "Configuración",
                logout: "Cerrar Sesión"
            },
            logoutModal: {
                title: "¿Ya te vas?",
                message: "Tu impacto ambiental es muy valioso. ¿Estás seguro de cerrar sesión?",
                cancel: "Cancelar",
                confirm: "Cerrar Sesión"
            },
            share: {
                message: "🌱 ¡Únete a Nos Planét! \nRecicla, gana puntos y canjea premios sostenibles. \nhttps://nosplanet.org/app"
            }
        },
        rewards: {
            title: "Recompensas",
            explore: "Explorar categorías",
            searching: "Buscando recompensas...",
            empty: "No hay premios disponibles en esta categoría por ahora.",
            successTitle: "¡Canje Exitoso! 🎉",
            successMsg: "Has canjeado \"{{title}}\".\n\nRevisa tu correo para las instrucciones.",
            accept: "Aceptar",
            categories: {
                all: "Todos",
                partners: "Convenios",
                products: "Productos",
                discounts: "Descuentos",
                experiences: "Experiencias",
                donations: "Donaciones"
            },
            greeting: "Hola, {{name}}",
            headerTitle: "Tienda de Premios",
            pointsLabel: "Tus EcoPuntos",
            historyText: "Historial",
            modal: {
                confirmTitle: "Confirmar Canje",
                confirmPrompt: "¿Estás seguro que deseas canjear tus puntos por:",
                currentPoints: "Tus puntos actuales:",
                pointsToRedeem: "Puntos a canjear:",
                remainingPoints: "Puntos restantes:",
                warningLow: "Te quedarán pocos puntos. ¡Sigue reciclando!",
                redeemNote: "Recibirás un código de canje que podrás usar para reclamar tu premio.",
                cancel: "Cancelar",
                confirm: "Confirmar",
                locked: "Bloqueado",
                needed: "Puntos necesarios",
                missing: "Te faltan {{count}} puntos",
                canRedeem: "¡Puedes canjearlo!",
                description: "Descripción",
                details: "Detalles",
                stock: "Stock disponible: {{count}} unidades",
                validUntil: "Válido hasta: {{date}}",
                sponsored: "Patrocinado por: {{name}}",
                terms: "Términos y Condiciones",
                actionRedeem: "Canjear Premio"
            }
        },
        home: {
            greeting: "Hola",
            nextLevel: "Siguiente nivel:",
            currentProgress: "TU PROGRESO ACTUAL",
            pointsUnit: "pts",
            roles: { citizen: "Generador", recycler: "Reciclador" },
            quote: "El mejor momento para plantar un árbol fue hace 20 años. El segundo mejor momento es ahora.",
            activeTask: { title: "Recojo en curso", subtitle: "Ver detalles de la ruta" },
            impact: {
                title: "Tu impacto este mes:",
                weight: "Peso",
                quantity: "Cantidad"
            },
            categories: {
                plastic: "Plástico",
                cardboard: "Cartón",
                metal: "Metal",
                electronics: "RAEE"
            },
            units: { kg: "kg", und: "und" },
            programs: {
                popular: "Programas Populares",
                loading: "Cargando programas...",
                empty: "No hay programas destacados hoy."
            },
            nav: {
                start: "Inicio",
                recycle: "Reciclar",
                requests: "Solicitudes",
                rewards: "Premios"
            }
        },
        personalData: {
            title: "Datos Personales",
            viewing: "Ver información",
            editing: "Modo edición",
            edit: "Editar",
            cancel: "Cancelar",
            changePhoto: "Cambiar Foto",
            saveChanges: "Guardar Cambios",
            dniLock: "Tu DNI no puede ser modificado. Si necesitas cambiarlo, contacta con soporte.",
            labels: {
                name: "Nombre Completo",
                email: "Correo Electrónico",
                phone: "Teléfono",
                dni: "DNI"
            },
            placeholders: {
                name: "Ingresa tu nombre completo",
                email: "tucorreo@email.com",
                phone: "+51 999 999 999"
            },
            alerts: {
                permissionTitle: "Permiso denegado",
                permissionMsg: "Se necesita permiso para acceder a la galería",
                errorTitle: "Error",
                emptyFields: "Por favor completa los campos requeridos",
                successTitle: "¡Éxito!",
                successMsg: "Tus datos han sido actualizados correctamente"
            },
            confirmModal: {
                title: "¿Guardar cambios?",
                message: "¿Estás seguro de que deseas guardar estos cambios en tu perfil?",
                confirm: "Guardar"
            }
        },
        induction: {
            title: "Inducción",
            subtitle: "Aprende todo sobre el reciclaje",
            loading: "Cargando lecciones...",
            empty: "No hay videos en esta categoría",
            categories: {
                all: "Todos",
                tutorial: "Tutorial",
                recycling: "Reciclaje",
                tips: "Eco-Tips",
                rewards: "Premios"
            }
        },
        forum: {
            title: "¡Bienvenido al Foro!",
            categories: {
                all: "Todos",
                doubts: "Dudas",
                projects: "Proyectos",
                general: "General"
            },
            banner: {
                welcome: "¡Hola, {{name}}!",
                description: "Conéctate con tu comunidad y comparte ideas verdes."
            },
            empty: "No hay publicaciones en esta categoría.",
            time: {
                years: "años",
                months: "meses",
                days: "días",
                hours: "horas",
                minutes: "min",
                ago: "hace",
                now: "hace un momento"
            },
            create: {
                success: "Publicación creada con éxito"
            },
            createPost: {
                title: "Crear Publicación",
                labels: {
                    category: "Categoría",
                    title: "Título",
                    description: "Descripción",
                    image: "Imagen (opcional)",
                    addImage: "Agregar imagen"
                },
                placeholders: {
                    title: "¿Qué quieres compartir?",
                    description: "Cuéntanos más detalles..."
                },
                alerts: {
                    permissionTitle: "Permiso denegado",
                    permissionMsg: "Necesitamos permiso para acceder a tus fotos y compartir tu idea."
                },
                buttons: {
                    submit: "Publicar"
                }
            },
            banner: {
                welcome: "¡Hola, {{name}}! 🌱",
                description: "Conéctate con tu comunidad y comparte ideas verdes."
            },
            empty: "No hay publicaciones en esta categoría todavía.",
            categories: {
                all: "Todos",
                doubts: "Dudas",
                projects: "Proyectos",
                general: "General"
            },
            title2: "Foro Comunitario",
        },
        donation: {
            header: "Hacer una donación",
            hero: {
                title: "Apoya nuestra causa",
                subtitle: "Escanea el QR o copia el número para realizar tu aporte voluntario."
            },
            card: {
                helper: "Sin comisiones",
                phoneLabel: "Número de celular:",
                beneficiary: "Juan David Huayta Ortega"
            },
            alerts: {
                copiedTitle: "¡Copiado!",
                copiedMsg: "Número copiado al portapapeles."
            },
            footer: "Tu donación ayuda a mantener los servidores."
        },
        partners: {
            title: "Convenios",
            categories: "Categorías",
            filterLabels: {
                all: "Todos",
                financial: "Financieros",
                government: "Gobierno",
                ong: "ONGs",
                corporate: "Corporativos"
            },
            loading: "Buscando aliados...",
            emptyState: "No hay convenios en esta categoría",
            allianceBanner: {
                title: "¿Quieres ser un aliado?",
                subtitle: "Únete a nuestra red de empresas sostenibles.",
                button: "Contactar"
            }
        },
        forumDetail: {
            commentsTitle: "Comentarios",
            total: "total",
            emptyState: "Sé el primero en comentar",
            placeholder: "Escribe una respuesta",
            alerts: {
                permissionTitle: "Permiso denegado",
                permissionMsg: "Necesitamos permiso para acceder a tus fotos"
            },
            badges: {
                likes: "Me gusta"
            }
        },
        programs: {
            title: "Programas Ambientales",
            loading: "Cargando...",
            activeCount: "{{count}} programas activos",
            empty: "No se encontraron programas en esta categoría.",
            noContact: "Sin contacto",
            filters: {
                all: "Todos",
                nosPlanet: "Nos Planét",
                ongs: "ONGs",
                state: "Estado"
            }
        },
        partnerHeader: {
            title: "Aliados Estratégicos",
            stats: {
                partners: "Aliados",
                rewards: "Premios"
            }
        },
        map: {
            title: "Solicitudes Cercanas",
            loading: "Localizando puntos...",
            searching: "Buscando solicitudes cerca de ti",
            availableNow: "Disponibles ahora",
            empty: "No hay solicitudes en esta zona",
            anonymous: "Usuario Anónimo",
            nearby: "Ubicación cercana",
            permissions: {
                denied: "Permiso denegado",
                message: "No podemos mostrar el mapa sin tu ubicación."
            },
            categories: {
                all: "Todos",
                plastic: "Plástico",
                paper: "Papel",
                cardboard: "Cartón",
                glass: "Vidrio",
                metal: "Metal",
                raee: "RAEE"
            }
        },
        about: {
            header: { title: "Acerca de Nosotros", subtitle: "Conoce más sobre Nos Planét" },
            mission: {
                title: "Nuestra Misión",
                text: "Transformar la gestión de residuos en una experiencia simple, accesible y gratificante para todos los ciudadanos, promoviendo una cultura de reciclaje y sostenibilidad en cada comunidad.",
                subtext: "Creemos que cada pequeña acción cuenta, y juntos podemos crear un impacto positivo significativo en nuestro planeta."
            },
            values: {
                title: "Nuestros Valores",
                transparency: { t: "Transparencia", d: "Operamos con honestidad y claridad en cada acción" },
                community: { t: "Comunidad", d: "Construimos juntos un futuro sostenible" },
                impact: { t: "Impacto Real", d: "Medimos y maximizamos nuestro impacto ambiental" },
                innovation: { t: "Innovación", d: "Desarrollamos soluciones creativas y tecnológicas" }
            },
            history: {
                title: "Nuestra Historia",
                text: "Fundada el 3 de noviembre de 2025, Nos Planét nació de la visión de emprendedores comprometidos con el medio ambiente y la tecnología. Somos una empresa nueva con sede en Lambayeque, dedicada a la consultoría de gestión ambiental y desarrollo de soluciones tecnológicas.",
                teamBtn: "Conoce al Equipo"
            },
            contact: {
                title: "Contacto",
                website: "Sitio Web",
                email: "Correo Electrónico"
            },
            footer: {
                copyright: "© 2025 Nos Planét SAC. Todos los derechos reservados."
            }
        },
        assistant: {
            title: "Asistente Virtual",
            messages: [
                "¡Hola! ¿Tienes dudas sobre reciclaje? 🌱",
                "¡Bienvenido! Estoy aquí para ayudarte 👋",
                "¿Necesitas ayuda con algo? Pregúntame 💬",
                "Aprende a reciclar mejor conmigo 📚",
                "¿Sabías que puedo ayudarte 24/7? ⏰"
            ]
        },
        rank: {
            loading: "Cargando rangos...",
            levelLabel: "Nivel",
            notAvailable: "No disponible",
            requirement: "REQUISITO",
            lockedDesc: "Necesitas reciclar más para desbloquear este rango y sus beneficios.",
            backBtn: "Volver",
            actionBtn: "¡Ir a Sumar Puntos!",
            shareBtn: "Compartir",
            points: "puntos",
            shareMessage: "🌿 *¡Mi Progreso en Nos Planét!* 🌿\n\n🏆 *Rango Actual:* {{name}} (Nivel {{level}})\n✨ _{{desc}}_\n\nPuntos: {{current}} / {{max}} XP\n\n♻️ ¡Ayúdame a salvar el planeta! 🌎"
        },
        memberCard: {
            progressLabel: "Progreso al siguiente nivel",
            defaultLevel: "Semilla de Cambio 🌱",
            defaultUser: "Usuario",
            pointsUnit: "pts"
        },
        team: {
            title: "Nuestro Equipo",
            leadership: "Liderazgo",
            devTeam: "Equipo de Desarrollo",
            roles: {
                ceo: "CEO & Fundadora",
                ops: "Director de Operaciones",
                dev: "Desarrollador"
            }
        },

    },
    en: {
        settings: {
            title: "Settings",
            general: "GENERAL",
            language: "Language",
            notification: "Notification",
            darkMode: "Dark Mode",
            security: "SECURITY",
            logout: "Log Out",
            changePassword: "Change Password",
            editProfile: "Edit Profile",
            twoStep: "2-Step Verification",
            helpCenter: "Help Center",
            terms: "Terms & Privacy",
            deleteAccount: "Delete Account",
            help: "Support & Legal",
            center: "Help Center"
        },
        team: {
            title: "Our Team",
            leadership: "Leadership",
            devTeam: "Development Team",
            roles: {
                ceo: "CEO & Founder",
                ops: "Director of Operations",
                dev: "Developer"
            }
        },
        memberCard: {
            progressLabel: "Progress to next level",
            defaultLevel: "Seed of Change 🌱",
            defaultUser: "User",
            pointsUnit: "pts"
        },
        map: {
            title: "Nearby Requests",
            loading: "Locating points...",
            searching: "Searching for requests near you",
            availableNow: "Available now",
            empty: "No requests in this area",
            anonymous: "Anonymous User",
            nearby: "Nearby location",
            permissions: {
                denied: "Permission denied",
                message: "We cannot show the map without your location."
            },
            categories: {
                all: "All",
                plastic: "Plastic",
                paper: "Paper",
                cardboard: "Cardboard",
                glass: "Glass",
                metal: "Metal",
                raee: "WEEE"
            }
        },
        assistant: {
            title: "Virtual Assistant",
            messages: [
                "Hi! Do you have questions about recycling? 🌱",
                "Welcome! I'm here to help you 👋",
                "Need help with something? Ask me 💬",
                "Learn to recycle better with me 📚",
                "Did you know I can help you 24/7? ⏰"
            ]
        },
        rewards: {
            title: "Rewards",
            explore: "Explore categories",
            searching: "Looking for rewards...",
            empty: "No rewards available in this category for now.",
            successTitle: "Successful Exchange! 🎉",
            successMsg: "You have redeemed \"{{title}}\".\n\nCheck your email for instructions.",
            accept: "Accept",
            categories: {
                all: "All",
                partners: "Partnerships",
                products: "Products",
                discounts: "Discounts",
                experiences: "Experiences",
                donations: "Donations"
            },
            greeting: "Hello, {{name}}",
            headerTitle: "Reward Store",
            pointsLabel: "Your EcoPoints",
            historyText: "History",
            modal: {
                confirmTitle: "Confirm Exchange",
                confirmPrompt: "Are you sure you want to redeem your points for:",
                currentPoints: "Your current points:",
                pointsToRedeem: "Points to redeem:",
                remainingPoints: "Remaining points:",
                warningLow: "You will have few points left. Keep recycling!",
                redeemNote: "You will receive a redemption code that you can use to claim your prize.",
                cancel: "Cancel",
                confirm: "Confirm",
                locked: "Locked",
                needed: "Points needed",
                missing: "You are missing {{count}} points",
                canRedeem: "You can redeem it!",
                description: "Description",
                details: "Details",
                stock: "Available stock: {{count}} units",
                validUntil: "Valid until: {{date}}",
                sponsored: "Sponsored by: {{name}}",
                terms: "Terms and Conditions",
                actionRedeem: "Redeem Prize"
            }
        },
        rank: {
            loading: "Loading ranks...",
            levelLabel: "Level",
            notAvailable: "Not available",
            requirement: "REQUIREMENT",
            lockedDesc: "You need to recycle more to unlock this rank and its benefits.",
            backBtn: "Back",
            actionBtn: "Go Earn Points!",
            shareBtn: "Share",
            points: "points",
            shareMessage: "🌿 *My Progress in Nos Planét!* 🌿\n\n🏆 *Current Rank:* {{name}} (Level {{level}})\n✨ _{{desc}}_\n\nPoints: {{current}} / {{max}} XP\n\n♻️ Help me save the planet! 🌎"
        },
        about: {
            header: { title: "About Us", subtitle: "Learn more about Nos Planét" },
            mission: {
                title: "Our Mission",
                text: "Transform waste management into a simple, accessible, and rewarding experience for all citizens, promoting a culture of recycling and sustainability in every community.",
                subtext: "We believe every small action counts, and together we can create a significant positive impact on our planet."
            },
            values: {
                title: "Our Values",
                transparency: { t: "Transparency", d: "We operate with honesty and clarity in every action" },
                community: { t: "Community", d: "Building a sustainable future together" },
                impact: { t: "Real Impact", d: "Measuring and maximizing our environmental impact" },
                innovation: { t: "Innovation", d: "Developing creative and technological solutions" }
            },
            history: {
                title: "Our History",
                text: "Founded on November 3, 2025, Nos Planét was born from the vision of entrepreneurs committed to the environment and technology. We are a new company based in Lambayeque, dedicated to environmental management consulting.",
                teamBtn: "Meet the Team"
            },
            contact: {
                title: "Contact",
                website: "Website",
                email: "Email Address"
            },
            footer: {
                copyright: "© 2025 Nos Planét SAC. All rights reserved."
            }
        },
        forum: {
            title: "Welcome to the Forum!",
            categories: {
                all: "All",
                doubts: "Questions",
                projects: "Projects",
                general: "General"
            },
            banner: {
                welcome: "Hi, {{name}}!",
                description: "Connect with your community and share green ideas."
            },
            empty: "No posts found in this category.",
            time: {
                years: "years",
                months: "months",
                days: "days",
                hours: "hours",
                minutes: "min",
                ago: "",
                now: "just now"
            },
            create: {
                success: "Post created successfully"
            },
            createPost: {
                title: "Create Post",
                labels: {
                    category: "Category",
                    title: "Title",
                    description: "Description",
                    image: "Image (optional)",
                    addImage: "Add image"
                },
                placeholders: {
                    title: "What's on your mind?",
                    description: "Tell us more details..."
                },
                alerts: {
                    permissionTitle: "Permission denied",
                    permissionMsg: "We need permission to access your photos to share your idea."
                },
                buttons: {
                    submit: "Publish"
                }
            },
            banner: {
                welcome: "Hello, {{name}}! 🌱",
                description: "Connect with your community and share green ideas."
            },
            empty: "No posts in this category yet.",
            categories: {
                all: "All",
                doubts: "Doubts",
                projects: "Projects",
                general: "General"
            },
            title2: "Community Forum",
        },
        forumDetail: {
            commentsTitle: "Comments",
            total: "total",
            emptyState: "Be the first to comment",
            placeholder: "Write a reply",
            alerts: {
                permissionTitle: "Permission denied",
                permissionMsg: "We need permission to access your photos"
            },
            badges: {
                likes: "Likes"
            }
        },
        induction: {
            title: "Induction",
            subtitle: "Learn everything about recycling",
            loading: "Loading lessons...",
            empty: "No videos in this category",
            categories: {
                all: "All",
                tutorial: "Tutorial",
                recycling: "Recycling",
                tips: "Eco-Tips",
                rewards: "Rewards"
            }
        },
        footprint: {
            header: {
                title: "Your Green Footprint",
                subtitle: "See what you've achieved"
            },
            planetStatus: {
                gray: { status: "Gray World", message: "Your planet needs help. Start recycling!" },
                recovering: { status: "Recovering", message: "The air feels cleaner thanks to you!" },
                radiant: { status: "Radiant World", message: "You're an environmental hero! Your world shines." }
            },
            co2Card: "Reduced Carbon Footprint",
            equivalencies: {
                title: "Real Equivalencies",
                subtitle: "To visualize your impact:",
                energy: "You saved energy for <bold>{{hours}} hours</bold> of a lightbulb or <bold>{{charges}} phone charges</bold>.",
                water: "You avoided water use equivalent to <bold>{{showers}} quick showers</bold>.",
                transport: "You avoided emissions equal to a <bold>{{km}} km</bold> car trip.",
                trees: "You have saved the equivalent of <bold>{{trees}} adult trees</bold>."
            },
            share: {
                button: "Brag About My Achievement",
                subtitle: "Inspire others to recycle",
                message: "🌿 This month my Green Footprint saved the equivalent of {{trees}} trees in the Nos Planét app. What did you do for the planet? 🌎 #Recycling #NosPlanét"
            }
        },
        drawer: {
            points: "points",
            logout: "Log Out",
            sections: {
                main: "Main",
                explore: "Explore",
                account: "Account"
            },
            items: {
                home: "Home",
                assistant: "Virtual Assistant",
                rank: "EcoPoints",
                footprint: "Your green footprint",
                profile: "My profile",
                donations: "Donations",
                partners: "Partners",
                programs: "Environmental Programs",
                induction: "Induction",
                forum: "Forum",
                about: "About Nos Planét",
                settings: "Settings"
            }
        },
        partnerHeader: {
            title: "Strategic Partners",
            stats: {
                partners: "Partners",
                rewards: "Rewards"
            }
        },
        programs: {
            title: "Environmental Programs",
            loading: "Loading...",
            activeCount: "{{count}} active programs",
            empty: "No programs found in this category.",
            noContact: "No contact info",
            filters: {
                all: "All",
                nosPlanet: "Nos Planét",
                ongs: "NGOs",
                state: "Government"
            }
        },
        home: {
            nextLevel: "Next level:",
            currentProgress: "YOUR CURRENT PROGRESS",
            pointsUnit: "pts",
            greeting: "Hello",
            roles: { citizen: "Self-generator", recycler: "Recycler" },
            quote: "The best time to plant a tree was 20 years ago. The second best time is now.",
            activeTask: { title: "Pickup in progress", subtitle: "View route details" },
            impact: {
                title: "Your impact this month:",
                weight: "Weight",
                quantity: "Quantity"
            },
            categories: {
                plastic: "Plastic",
                cardboard: "Cardboard",
                metal: "Metal",
                electronics: "WEEE"
            },
            units: { kg: "kg", und: "unit" },
            programs: {
                popular: "Popular Programs",
                loading: "Loading programs...",
                empty: "No featured programs today."
            },
            nav: {
                start: "Home",
                recycle: "Recycle",
                requests: "Requests",
                rewards: "Rewards"
            }
        },

        logoutModal: {
            title: "Log Out",
            message: "Are you sure you want to log out?",
            cancel: "Cancel",
            confirm: "Log Out"
        },
        donation: {
            header: "Make a donation",
            hero: {
                title: "Support our cause",
                subtitle: "Scan the QR or copy the number to make your voluntary contribution."
            },
            card: {
                helper: "No fees",
                phoneLabel: "Phone number:",
                beneficiary: "Juan David Huayta Ortega"
            },
            alerts: {
                copiedTitle: "Copied!",
                copiedMsg: "Number copied to clipboard."
            },
            footer: "Your donation helps maintain the servers."
        },
        ai: {
            title: "Planet Bot",
            subtitle: "Planetary Assistant",
            welcome: "Hi! I'm Planet Bot 🌿. I'm here to help you recycle better. Select a question above or write your own.",
            suggested: "Frequently Asked Questions:",
            placeholder: "Write your question about recycling...",
            typing: "Planet Bot is typing...",
            error: "❌ Sorry, Planet Bot had a problem. Try again.",
            tips: [
                "💡 Did you know? A plastic bottle takes 500 years to decompose.",
                "🌿 Recycling 1 ton of paper saves 17 trees!",
                "🧴 Remember to wash and crush your bottles before recycling.",
                "🔋 Batteries never go in regular trash, they are toxic!",
                "🔄 Circular economy helps reduce waste.",
                "🌍 Small actions generate big changes."
            ]
        },
        partners: {
            title: "Partnerships",
            categories: "Categories",
            filterLabels: {
                all: "All",
                financial: "Financial",
                government: "Government",
                ong: "NGOs",
                corporate: "Corporate"
            },
            loading: "Searching for partners...",
            emptyState: "No partnerships in this category",
            allianceBanner: {
                title: "Want to be a partner?",
                subtitle: "Join our network of sustainable companies.",
                button: "Contact"
            }
        },
        terms: {
            title: "Terms & Privacy",
            tabs: { use: "Terms of Use", privacy: "Privacy" },
            lastUpdate: "Last update: March 5, 2026",
            contactSubject: "Legal Inquiry - Nos Planét",
            useSections: [
                {
                    title: "1. Acceptance of Terms",
                    text: "By accessing and using the Nos Planét app ('the App'), you agree to be bound by these Terms and Conditions. If you do not agree with these terms, please do not use the application."
                },
                {
                    title: "2. App Usage",
                    text: "The App provides a platform to promote recycling and environmental sustainability. Users can accumulate EcoPoints for verified recycling activities and redeem them for rewards available in our catalog."
                },
                {
                    title: "3. User Account",
                    text: "You are responsible for providing truthful information when registering. You must maintain the security of your password and are solely responsible for all activities conducted under your account."
                },
                {
                    title: "4. EcoPoints System",
                    text: "EcoPoints are an internal unit of measurement to incentivize recycling and have no real monetary value. We reserve the right to modify accumulation rates and the rewards catalog based on availability."
                },
                {
                    title: "5. Prohibited Conduct",
                    text: "It is prohibited to manipulate the weighing system, provide false recycling photos, harass other users, or use the App for unauthorized commercial purposes."
                }
            ],
            privacySections: [
                {
                    title: "1. Information Collected",
                    text: "We collect your name, email, phone number, and data regarding your recycling activity (materials, weight, and frequency) to manage your account and environmental impact."
                },
                {
                    title: "2. Data Usage",
                    text: "Your data is used exclusively to validate your EcoPoints, personalize your App experience, process reward redemptions, and send service updates."
                },
                {
                    title: "3. Information Protection",
                    text: "We implement technical security measures such as SSL encryption and secure databases to protect your personal information against unauthorized access."
                },
                {
                    title: "4. Your Rights",
                    text: "You have the right to Access, Rectify, Cancel, or Object to the processing of your data. You may request the permanent deletion of your account in the settings section."
                }
            ]
        },
        password: {
            description: "Create a secure password of at least 8 characters",
            currentLabel: "Current Password",
            currentPlaceholder: "Enter your current password",
            newLabel: "New Password",
            newPlaceholder: "Enter your new password",
            confirmLabel: "Confirm New Password",
            confirmPlaceholder: "Confirm your new password",
            reqTitle: "Password must contain:",
            reqChars: "At least 8 characters",
            reqUpper: "One uppercase letter",
            reqNumber: "One number",
            reqMatch: "Passwords match",
            btnChange: "Change Password",
            modalConfirmTitle: "Change Password?",
            modalConfirmMsg: "Are you sure? This action will update your login method.",
            modalSuccessTitle: "Password Changed!",
            modalSuccessMsg: "Your password has been successfully updated.",
            btnConfirm: "Yes, Change",
            btnCancel: "Cancel",
            btnOk: "Got it"
        },

        support: {
            title: "Help Center",
            contact: {
                whatsapp: "WhatsApp",
                email: "Email"
            },
            sections: {
                topics: "Help Topics",
                faqs: "FAQs",
                moreHelp: "Need more help?"
            },
            topics: {
                recycle: { title: "How to recycle?", desc: "Learn the steps to recycle correctly" },
                points: { title: "How to earn points?", desc: "Discover all ways to accumulate EcoPoints" },
                rewards: { title: "Redeem rewards", desc: "Guide to redeeming your points" },
                contact: { title: "Contact support", desc: "Send us a message directly", subject: "Help Request" }
            },
            faqs: [
                { q: "How do I verify my account?", a: "To verify your account, go to Settings > Profile and follow the steps. You'll need a valid ID." },
                { q: "When do my points appear?", a: "Points appear immediately after activity. If not visible within 24h, contact us." },
                { q: "Can I transfer points?", a: "No, EcoPoints are personal and non-transferable." },
                { q: "Do rewards expire?", a: "Yes, some rewards have expiration dates. Check terms before redeeming." }
            ],
            modals: {
                gotIt: "Got it",
                close: "Close",
                recycle: {
                    title: "How to Recycle?",
                    steps: [
                        { t: "Separate waste", d: "Sort materials: paper, cardboard, plastic, glass and metal." },
                        { t: "Clean materials", d: "Ensure containers are clean and dry." },
                        { t: "Request pickup", d: "Use the app to request a pickup for your materials." },
                        { t: "Earn EcoPoints", d: "Accumulate points for every kilo recycled." }
                    ]
                },
                points: {
                    title: "How to Earn Points?",
                    cards: [
                        { t: "Recycling", p: "50-200 pts/kg", d: "Points for every kilogram recycled." },
                        { t: "Invite friends", p: "100 pts per guest", d: "Earn when friends complete their first recycle." },
                        { t: "Achievements", p: "50-500 pts", d: "Complete weekly challenges." }
                    ]
                },
                rewards: {
                    title: "Redeem Rewards",
                    desc: "Follow these steps to get rewards:",
                    steps: ["Go to Rewards", "Choose your reward", "Confirm redemption", "Receive reward"],
                    tip: "Check terms before redeeming.",
                    induction: { title: "Want to know more?", sub: "Complete Interactive Induction" }
                }
            }
        },
        editProfile: {
            title: "Edit Profile",
            changePhoto: "Change Photo",
            fullName: "Full Name",
            phone: "Phone Number",
            save: "Save Changes",
            placeholders: {
                name: "Enter your full name",
                phone: "Enter your phone number"
            },
            alerts: {
                permission: "Permission needed",
                gallery: "We need access to your gallery.",
                nameReq: "Name is required",
                success: "Profile updated successfully!",
                error: "Could not update profile. Try again."
            }
        },
        profile: {
            title: "Profile",
            ecoCitizen: "Eco Citizen",
            recycled: "Recycled",
            water: "Water",
            userType: "Eco Citizen",
            stats: {
                recycled: "Recycled",
                water: "Water",
                achievements: "Achievements"
            },
            sections: {
                security: "Account & Security",
                community: "Community"
            },
            menu: {
                personalData: "Personal Data",
                history: "History",
                invite: "Invite Friends",
                settings: "Settings",
                logout: "Log Out"
            },
            logoutModal: {
                title: "Leaving so soon?",
                message: "Your environmental impact is very valuable. Are you sure you want to log out?",
                cancel: "Cancel",
                confirm: "Log Out"
            },
            share: {
                message: "🌱 Join Nos Planét! \nRecycle, earn points, and redeem sustainable rewards. \nhttps://nosplanet.org/app"
            }
        },
        personalData: {
            title: "Personal Data",
            viewing: "View information",
            editing: "Editing mode",
            edit: "Edit",
            cancel: "Cancel",
            changePhoto: "Change Photo",
            saveChanges: "Save Changes",
            dniLock: "Your ID Number cannot be modified. If you need to change it, contact support.",
            labels: {
                name: "Full Name",
                email: "Email Address",
                phone: "Phone",
                dni: "ID Number"
            },
            placeholders: {
                name: "Enter your full name",
                email: "yourmail@email.com",
                phone: "+51 999 999 999"
            },
            alerts: {
                permissionTitle: "Permission denied",
                permissionMsg: "Permission is needed to access the gallery",
                errorTitle: "Error",
                emptyFields: "Please complete all required fields",
                successTitle: "Success!",
                successMsg: "Your data has been successfully updated"
            },
            confirmModal: {
                title: "Save changes?",
                message: "Are you sure you want to save these changes to your profile?",
                confirm: "Save"
            }
        }
    }
};
export const obtenerDiaActual = () => {
    return new Date().toLocaleDateString('es-ES', { weekday: 'long' }).toLowerCase();
};


export const obtenerItinerarioDelDia = () => {
    const itinerario = {
        "viernes": [
            {
                "hora": "6:30 PM",
                "nombre": "Bienvenida",
                "encargado": "Asesoría y Coordinación General",
                "descripcion": "Tendremos una breve explicación sobre lo que viviremos este fin de semana junto con la dinámica, logística y objetivo del evento.",
                "imagen": ""
            },
            {
                "hora": "7:00 PM",
                "nombre": "Bloque Temático 1: Cultura del Buen Trato",
                "encargado": "Equipo Cultura del Cuidado del Menor",
                "descripcion": "El Equipo de la Cultura del Cuidado del Menor nos prepará y encaminará mediante este taller en este tema emergente tan esencial para salvaguardar la integridad de nuestros menores en todos los grupos.",
                "imagen": ""
            },
            {
                "hora": "9:00 PM",
                "nombre": "Etapa 1: Entrada al Desierto",
                "encargado": "Coordinación General",
                "descripcion": "¿Cómo es la entrada al desierto? ¿Cómo se relaciona con nuestros inicios en las Coordinaciones y Asesorías? Empezamos caminando ciegamente sin saber a donde ir pero confiando en que Dios nos iluminará el camino.",
                "imagen": ""
            }
        ],    
        "sabado": [
            {
                "hora": "10:00 AM",
                "nombre": "Etapa 2: El Caminar por el Desierto",
                "encargado": "Coordinación General",
                "descripcion": "El desierto es un espacio de dificultades, amenazas y retos que debemos de superar. Tenemos que continuar en él, tomando las mejores decisiones para el bienestar de los nuestros, es un camino lleno de crecimiento.",
                "imagen": ""
            },
            {
                "hora": "10:30 AM",
                "nombre": "Presentación de Postulación de Coordinación General",
                "encargado": "Asesoría y Coordinación General",
                "descripcion": "Espacio para poder conocer a fondo las propuestas de Coordinación General, resolver dudas y aclarar objetivos.",
                "imagen": ""
            },
            {
                "hora": "11:00 AM",
                "nombre": "Bloque Temático 2: Función de la Ley en la Identidad de los Adolescentes y Jóvenes de las culturas contemporáneas.",
                "encargado": "Juan Carlos Equihua M.S.p.S.",
                "descripcion": "PENDIENTE A DESCRIPCIÓN.",
                "imagen": ""
            },
            {
                "hora": "1:00 PM",
                "nombre": "Dinámica de Integración",
                "encargado": "Coordinación General",
                "descripcion": "¿Quién soy yo y qué ofrezco de mi como coordinador y persona para ti?",
                "imagen": ""
            },
            {
                "hora": "2:30 PM",
                "nombre": "Comida y Receso",
                "encargado": "Coordinación General",
                "descripcion": "Sin información extra.",
                "imagen": ""
            },
            {
                "hora": "4:30 PM",
                "nombre": "Presentación de Postulación de Coordinación General",
                "encargado": "Asesoría y Coordinación General",
                "descripcion": "Espacio para poder conocer a fondo las propuestas de Coordinación General, resolver dudas y aclarar objetivos.",
                "imagen": ""
            },
            {
                "hora": "5:00 PM",
                "nombre": "Votaciones Coordinación General",
                "encargado": "Asesoría y Coordinación General",
                "descripcion": "Espacio para poder discernir el voto por grupos sobre cuál será el grupo representativo en la Coordinación General en base a las presentaciones previas.",
                "imagen": ""
            },
            {
                "hora": "8:00 PM",
                "nombre": "Eucaristía y Nombramiento de Nueva Coordinación",
                "encargado": "Asesoría y Coordinación General",
                "descripcion": "Sin información extra.",
                "imagen": ""
            }
        ],
        "domingo": [
            {
                "hora": "8:00 AM",
                "nombre": "Etapa 3: La Salida del Desierto",
                "encargado": "Coordinación General",
                "descripcion": "¿Cómo es salir del desierto? No debemos de permanecer siempre en él, debemos salir y ser mejores personas cuando lleguemos al otro lado. Tal vez no nos toque ver el resultado de lo que empezamos y sembramos, lo importante es encaminar a los demás para ello.",
                "imagen": ""
            },
            {
                "hora": "8:30 AM",
                "nombre": "Testimonio de Asesores",
                "encargado": "Asesoría General",
                "descripcion": "Sin información extra.",
                "imagen": ""
            },
            {
                "hora": "9:00 AM",
                "nombre": "Bloque Temático 3: Reglamento del Movimiento Éxodo",
                "encargado": "Asesoría General",
                "descripcion": "Espacio para dialogar de manera proactiva movimientos que se podrán realizar al reglamento, se busca actualizarlo en base a las necesidades actuales del Movimiento Éxodo.",
                "imagen": ""
            },
            {
                "hora": "11:00 AM",
                "nombre": "Reporte Coordinación General",
                "encargado": "Asesoría General",
                "descripcion": "Espacio para presentar informe de actividades y de movimientos económicos de la gestión saliente a cargo de Éxodo Cadés.",
                "imagen": ""
            },
            {
                "hora": "11:30 AM",
                "nombre": "Recertificaciones y Avisos",
                "encargado": "Asesoría General",
                "descripcion": "Sin información extra.",
                "imagen": ""
            },
            {
                "hora": "12:00 PM",
                "nombre": "Foto General y Despedida",
                "encargado": "Coordinación General",
                "descripcion": "Sin información extra.",
                "imagen": ""                
            }
        ]
    }
    const diaActual = obtenerDiaActual();
    return itinerario[diaActual] || [];
};

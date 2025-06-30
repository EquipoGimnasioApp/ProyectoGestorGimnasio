import HeaderLanding from "../header-landing/HeaderLanding"
import Container from "@mui/material/Container"
import Box from "@mui/material/Box"
import FooterLanding from "../footer-landing/FooterLanding"
import { Outlet } from "react-router-dom"
import Button from "@mui/material/Button"
import React from "react"
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined"
import FitnessCenterOutlinedIcon from "@mui/icons-material/FitnessCenterOutlined"
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined"
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined"
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined"
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"
import ContactoLandingForm from "./ContactoLandingForm"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import { Navigation, Pagination, Autoplay } from "swiper/modules"

function Landing() {
  const carouselItems = [
    {
      image: "/computadora.jpg",
      title: "Gestión Integral",
      text: "Gestioná tu gimnasio de forma simple y profesional desde un solo lugar.",
    },
    {
      image: "/hombre_celular.jpg",
      title: "Facilidad de uso",
      text: "En cualquier lugar, desde tu compu, celu o tablet administrá de manera sencilla la gestión de clases, pagos, fichas, mails, equipamiento, etc.",
    },
  ]

  const faqData = [
    {
      question: "¿El programa requiere instalación?",
      answer:
        "No. Es una plataforma 100% online. Solo necesitás un navegador y conexión a internet para acceder desde cualquier dispositivo (PC, tablet o celular).",
    },
    {
      question: "¿Quiénes pueden acceder al sistema?",
      answer:
        "El sistema tiene tres tipos de usuarios: administradores, profesores y alumnos. Cada uno ve únicamente las funciones relacionadas con su rol.",
    },
    {
      question: "¿Cómo se anotan los alumnos a las clases?",
      answer:
        "Desde su perfil, el alumno puede ver el cronograma de actividades y reservar lugar según disponibilidad. También puede cancelar o reprogramar turnos.",
    },
    {
      question: "¿Cómo se reciben las notificaciones?",
      answer: "Las notificaciones se reciben por email y pueden verse en el panel del sistema.",
    },
    {
      question: "¿Qué pasa si se pierde internet en el gimnasio?",
      answer:
        "Como es un sistema en la nube, podés acceder desde cualquier lugar. Si se corta internet en el gimnasio, el administrador puede ingresar desde otro dispositivo conectado.",
    },
    {
      question: "¿El sistema guarda un historial de asistencia y pagos?",
      answer: "Sí, el sistema almacena el historial de asistencia y pagos de cada cliente.",
    },
  ]
  const [openFaq, setOpenFaq] = React.useState(null)
  const [showScroll, setShowScroll] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      const caracteristicas = document.getElementById("caracteristicas")
      if (caracteristicas) {
        const top = caracteristicas.getBoundingClientRect().top + window.scrollY
        setShowScroll(window.scrollY + 100 >= top)
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <>
      <Box
        className="landing-section"
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          overflowX: "hidden",
        }}
      >
        <HeaderLanding />
        <Box
          sx={{
            width: "100%",
            maxWidth: 1900,
            height: 750,
            margin: "0 auto",
            borderRadius: 2,
            overflow: "hidden",
            marginTop: "15px",
          }}
        >
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000 }}
            loop={true}
            style={{ height: "750px" }}
          >
            {carouselItems.map((item, i) => (
              <SwiperSlide key={i}>
                <Box sx={{ position: "relative", height: "750px" }}>
                  <Box
                    component="img"
                    src={item.image}
                    alt="carousel-img"
                    sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      background: "rgba(0,0,0,0.45)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      px: 2,
                    }}
                  >
                    <Box sx={{ fontSize: { xs: 54, md: 80 }, fontWeight: 600, mb: 3 }}>{item.title}</Box>
                    <Box sx={{ fontSize: { xs: 22, md: 30 }, maxWidth: 900, mb: 3, textAlign: "center" }}>
                      {item.text}
                    </Box>
                    <Button
                      href="#contactoLanding"
                      variant="contained"
                      sx={{
                        mt: 3,
                        fontWeight: 600,
                        fontSize: 16,
                        borderRadius: 8,
                        px: 4,
                        py: 1.5,
                        background: "black",
                        "&:hover": { background: "#222" },
                      }}
                    >
                      CONTRATÁ AHORA
                    </Button>
                  </Box>
                </Box>
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>

        <Box
          id="caracteristicas"
          sx={{
            width: "100%",
            background: "#fff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            py: { xs: 6, md: 8 },
            px: 2,
            marginTop: "25px",
          }}
        >
          <Box
            sx={{
              fontSize: 32,
              fontWeight: 400,
              mb: 3,
              textAlign: "center",
              letterSpacing: 0.2,
              lineHeight: 1.2,
            }}
          >
            Características{" "}
            <Box component="span" sx={{ fontWeight: 700 }}>
              Fit Manager
            </Box>
          </Box>
          <Box
            sx={{
              fontSize: 18,
              color: "#444",
              mb: 3,
              textAlign: "center",
              maxWidth: 900,
              lineHeight: 1.6,
              letterSpacing: 0.1,
            }}
          >
            Fit Manager brinda un sistema integral de soluciones informáticas para la gestión diaria.
            <br />
            Nuestro sistema web permite a administradores, profesores y alumnos acceder desde cualquier dispositivo con
            conexión a Internet, sin necesidad de instalar software.
            <br />
            Con una interfaz moderna, simple y segura, FitManager centraliza las tareas administrativas del gimnasio,
            mejora la experiencia del cliente y ahorra tiempo valioso al equipo de trabajo.
            <br />
            Toda la información se almacena en la nube, garantizando accesibilidad 24/7 y seguridad de los datos.
            <br />
            Nuestro equipo de soporte está siempre a tu lado para que aproveches Fit Manager al máximo.
          </Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(3, 1fr)" },
              gap: { xs: 4, md: 6 },
              mt: 6,
              width: "100%",
              maxWidth: 1100,
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", px: 2, gap: 2 }}>
              <LockOutlinedIcon sx={{ fontSize: 48, mb: 1 }} />
              <Box sx={{ fontSize: 20, fontWeight: 500, mb: 1, textAlign: "center", lineHeight: 1.3 }}>
                Accesos personalizados
              </Box>
              <Box sx={{ fontSize: 16, color: "#444", textAlign: "center", lineHeight: 1.6, maxWidth: 340 }}>
                Cada usuario tiene su perfil: Administrador, Profesor o Alumno, con funcionalidades específicas
                adaptadas a sus necesidades diarias.
              </Box>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", px: 2, gap: 2 }}>
              <EventAvailableOutlinedIcon sx={{ fontSize: 48, mb: 1 }} />
              <Box sx={{ fontSize: 20, fontWeight: 500, mb: 1, textAlign: "center", lineHeight: 1.3 }}>
                Gestión de clases
              </Box>
              <Box sx={{ fontSize: 16, color: "#444", textAlign: "center", lineHeight: 1.6, maxWidth: 340 }}>
                Los alumnos pueden reservar clases desde la plataforma, ver sus horarios y reprogramar si lo necesitan.
                El administrador controla cupos y asistencia en tiempo real.
              </Box>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", px: 2, gap: 2 }}>
              <FitnessCenterOutlinedIcon sx={{ fontSize: 48, mb: 1 }} />
              <Box sx={{ fontSize: 20, fontWeight: 500, mb: 1, textAlign: "center", lineHeight: 1.3 }}>Rutinas</Box>
              <Box sx={{ fontSize: 16, color: "#444", textAlign: "center", lineHeight: 1.6, maxWidth: 340 }}>
                Los profesores suben las rutinas desde su perfil, y los alumnos pueden consultarlas según su actividad o
                nivel de entrenamiento.
              </Box>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", px: 2, gap: 2 }}>
              <CreditCardOutlinedIcon sx={{ fontSize: 48, mb: 1 }} />
              <Box sx={{ fontSize: 20, fontWeight: 500, mb: 1, textAlign: "center", lineHeight: 1.3 }}>
                Control de pagos
              </Box>
              <Box sx={{ fontSize: 16, color: "#444", textAlign: "center", lineHeight: 1.6, maxWidth: 340 }}>
                El sistema permite registrar cuotas abonadas, visualizar deudas y enviar notificaciones automáticas
                sobre vencimientos o recordatorios.
              </Box>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", px: 2, gap: 2 }}>
              <Inventory2OutlinedIcon sx={{ fontSize: 48, mb: 1 }} />
              <Box sx={{ fontSize: 20, fontWeight: 500, mb: 1, textAlign: "center", lineHeight: 1.3 }}>
                Control de equipamiento
              </Box>
              <Box sx={{ fontSize: 16, color: "#444", textAlign: "center", lineHeight: 1.6, maxWidth: 340 }}>
                Administrá los insumos y materiales del gimnasio para evitar faltantes en las clases (pesas,
                colchonetas, bicicletas, etc.).
              </Box>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", px: 2, gap: 2 }}>
              <MailOutlineOutlinedIcon sx={{ fontSize: 48, mb: 1 }} />
              <Box sx={{ fontSize: 20, fontWeight: 500, mb: 1, textAlign: "center", lineHeight: 1.3 }}>
                Notificaciones
              </Box>
              <Box sx={{ fontSize: 16, color: "#444", textAlign: "center", lineHeight: 1.6, maxWidth: 340 }}>
                Recordatorios de vencimientos, turnos agendados, o novedades del gimnasio, todo desde una sola
                plataforma.
              </Box>
            </Box>
          </Box>
        </Box>

        <Box
          id="precios"
          sx={{
            width: "100%",
            background: "#fff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            py: 6,
          }}
        >
          <Box
            sx={{
              fontSize: 32,
              fontWeight: 500,
              mb: 2,
              textAlign: "center",
              lineHeight: 1.2,
              letterSpacing: 0.2,
            }}
          >
            Precios
          </Box>
          <Box
            sx={{
              fontSize: 18,
              color: "#444",
              mb: 4,
              textAlign: "center",
              lineHeight: 1.6,
              letterSpacing: 0.1,
            }}
          >
            Precios expresados en Pesos y sólo válidos para la República Argentina.
          </Box>
          <Box
            sx={{
              background: "#fff",
              boxShadow:
                "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
              border: "1px solid #ddd",
              borderRadius: 2,
              maxWidth: 400,
              width: "100%",
              mx: "auto",
              p: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box sx={{ fontSize: 28, fontWeight: 400, mb: 1, lineHeight: 1.2 }}>Estándar</Box>
            <Box sx={{ fontSize: 18, color: "#444", mb: 2, lineHeight: 1.5 }}>Desde...</Box>
            <Box sx={{ fontSize: 54, fontWeight: 400, mb: 1, lineHeight: 1.1 }}>$ 30000</Box>
            <Box sx={{ fontSize: 18, color: "#444", mb: 1, lineHeight: 1.5 }}>por mes*</Box>
            <Box sx={{ fontSize: 18, color: "#444", mb: 2, lineHeight: 1.5 }}>Incluye:</Box>
            <Box
              sx={{
                fontSize: 17,
                color: "#222",
                mb: 1,
                textAlign: "center",
                lineHeight: 1.6,
              }}
            >
              Sistema Administrativo Web
            </Box>
            <Box
              sx={{
                fontSize: 17,
                color: "#222",
                mb: 1,
                textAlign: "center",
                lineHeight: 1.6,
              }}
            >
              Cantidad ilimitada de usuarios administradores, profesionales, salas
            </Box>
            <Box
              sx={{
                fontSize: 17,
                color: "#222",
                mb: 1,
                textAlign: "center",
                lineHeight: 1.6,
              }}
            >
              Posibilidad de varias Sucursales
            </Box>
            <Box
              sx={{
                fontSize: 17,
                color: "#222",
                mb: 3,
                textAlign: "center",
                lineHeight: 1.6,
              }}
            >
              WebApp para los clientes
            </Box>
            <Button
              href="#contactoLanding"
              variant="contained"
              sx={{
                backgroundColor: "#111",
                color: "#fff",
                borderRadius: 2,
                px: 6,
                py: 1.5,
                fontWeight: 500,
                fontSize: 18,
                boxShadow: "none",
                textTransform: "none",
                "&:hover": { backgroundColor: "#222" },
              }}
            >
              Contratar
            </Button>
          </Box>
          <Box
            sx={{
              fontSize: 15,
              color: "#444",
              mt: 4,
              textAlign: "center",
              maxWidth: 600,
              lineHeight: 1.6,
            }}
          >
            El valor del plan Estándar mínimo es hasta 50 clientes activos.
            <br />
            Consultar por cantidad de clientes activos.
          </Box>
        </Box>
        <Box
          id="faq"
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            py: 8,
            px: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 6,
              width: "100%",
              maxWidth: 1200,
              justifyContent: "center",
              alignItems: { xs: "center", md: "flex-start" },
            }}
          >
            <Box sx={{ flex: 2, minWidth: 320 }}>
              <Box
                sx={{
                  fontSize: 32,
                  fontWeight: 500,
                  mb: 1,
                  textAlign: "center",
                  lineHeight: 1.2,
                  letterSpacing: 0.2,
                }}
              >
                Preguntas y respuestas FAQ
              </Box>
              <Box
                sx={{
                  fontSize: 18,
                  color: "#444",
                  mb: 4,
                  textAlign: "center",
                  lineHeight: 1.6,
                  letterSpacing: 0.1,
                }}
              >
                En esta sección se responden algunas preguntas frecuentes.
                <br />
                Para resolver cualquier consulta o duda lo mejor es concretar una reunión presencial o por
                videoconferencia.
              </Box>
              <Box>
                {faqData.map((item, idx) => (
                  <Box key={idx}>
                    <Box
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      sx={{
                        border: "1px solid #ccc",
                        borderRadius: 1,
                        mb: openFaq === idx ? 0 : 1.5,
                        background: "#fff",
                        px: 2.5,
                        py: 1.5,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        fontSize: 18,
                        fontWeight: 400,
                        cursor: "pointer",
                        transition: "border-radius 0.2s",
                        borderBottomLeftRadius: openFaq === idx ? 0 : 4,
                        borderBottomRightRadius: openFaq === idx ? 0 : 4,
                        boxShadow: openFaq === idx ? "0 2px 8px 0 rgba(0,0,0,0.04)" : "none",
                        lineHeight: 1.4,
                      }}
                    >
                      {item.question}
                      <Box
                        sx={{
                          fontSize: 28,
                          color: "#888",
                          ml: 2,
                          lineHeight: 1,
                          transform: openFaq === idx ? "rotate(45deg)" : "none",
                          transition: "transform 0.2s",
                        }}
                      >
                        +
                      </Box>
                    </Box>
                    {openFaq === idx && (
                      <Box
                        sx={{
                          border: "1px solid #ccc",
                          borderTop: "none",
                          borderBottomLeftRadius: 4,
                          borderBottomRightRadius: 4,
                          background: "#fff",
                          px: 2.5,
                          py: 1.5,
                          fontSize: 17,
                          color: "#222",
                          mb: 1.5,
                          boxShadow: "0 2px 8px 0 rgba(0,0,0,0.04)",
                          animation: "fadeInFaq 0.2s",
                          lineHeight: 1.6,
                        }}
                      >
                        {item.answer}
                      </Box>
                    )}
                  </Box>
                ))}
              </Box>
            </Box>
            <Box
              sx={{
                flex: 1,
                minWidth: 300,
                background: "#fff",
                boxShadow:
                  "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
                border: "1px solid #ddd",
                borderRadius: 2,
                p: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                maxWidth: 350,
                gap: 2,
                mt: { xs: 4, md: "163px" },
                height: "fit-content",
              }}
            >
              <Box
                sx={{
                  fontSize: 24,
                  fontWeight: 500,
                  mb: 1,
                  textAlign: "center",
                  lineHeight: 1.3,
                }}
              >
                ¿Tenés más dudas?
              </Box>
              <Box
                sx={{
                  fontSize: 16,
                  color: "#444",
                  mb: 3,
                  textAlign: "center",
                  lineHeight: 1.6,
                }}
              >
                Escribí una consulta y tendrás una respuesta a la brevedad.
              </Box>
              <Button
                href="/#contactoLanding"
                variant="contained"
                sx={{
                  backgroundColor: "#111",
                  color: "#fff",
                  borderRadius: 2,
                  px: 4,
                  py: 1.5,
                  fontWeight: 500,
                  fontSize: 18,
                  boxShadow: "none",
                  textTransform: "none",
                  width: "100%",
                  mb: 2,
                  "&:hover": { backgroundColor: "#222" },
                }}
              >
                Contacto
              </Button>
            </Box>
          </Box>
        </Box>
        <Container
          maxWidth="lg"
          component="main"
          sx={{
            mt: 4,
            mb: 4,
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              p: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              maxWidth: "lg",
            }}
          >
            <Outlet />
          </Box>
        </Container>
        <Box
          id="contactoLanding"
          sx={{
            width: "100%",
            background: "#fff",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            py: 8,
            px: 2,
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: 900,
              background: "#fff",
              boxShadow:
                "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
              border: "1px solid #ddd",
              borderRadius: 2,
              p: { xs: 2, sm: 6 },
              mx: "auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box sx={{ fontSize: 32, fontWeight: 500, mb: 2, textAlign: "center", lineHeight: 1.2 }}>
              Consultar o Contratar
            </Box>
            <Box sx={{ fontSize: 18, color: "#444", mb: 4, textAlign: "center", maxWidth: 800, lineHeight: 1.6 }}>
              ¿Tenés un gimnasio? Si querés contratar el servicio del sistema de gestión Fit Manager,
              <br />
              por favor completá el formulario y nos comunicaremos a la brevedad.
            </Box>
            <ContactoLandingForm />
          </Box>
        </Box>
        <FooterLanding />
        {showScroll && (
          <Box
            onClick={handleScrollTop}
            sx={{
              position: "fixed",
              bottom: 32,
              right: 32,
              zIndex: 9999,
              backgroundColor: "#111",
              color: "#fff",
              borderRadius: 2,
              width: 48,
              height: 48,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 16px 0 rgba(0,0,0,0.10)",
              cursor: "pointer",
              transition: "background 0.2s",
              "&:hover": {
                backgroundColor: "#222",
              },
            }}
          >
            <KeyboardArrowUpIcon sx={{ fontSize: 32 }} />
          </Box>
        )}
      </Box>
    </>
  )
}

export default Landing

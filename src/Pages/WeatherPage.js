import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from 'axios';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto'; // ใช้ Chart.js

const WeatherPage = () => {
  const { city } = useParams(); // ดึงชื่อเมืองจาก URL
  const [weatherData, setWeatherData] = useState(null);
  const [hourlyData, setHourlyData] = useState(null);
  const [coords, setCoords] = useState([13.7563, 100.5018]); // Default to Bangkok's coordinates
  const navigate = useNavigate(); // ใช้สำหรับการย้อนกลับ

  // ฟังก์ชันสำหรับย้อนกลับไปหน้าที่แล้ว
  const handleGoBack = () => {
    navigate(-1); // กลับไปหน้าก่อนหน้า
  };

  // ดึงข้อมูลสภาพอากาศของเมืองที่เลือกและพยากรณ์รายชั่วโมง
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const weatherResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=8b35135ee79e413bbaf7af96a83ff742&units=metric`
        );
        setWeatherData(weatherResponse.data);
        setCoords([weatherResponse.data.coord.lat, weatherResponse.data.coord.lon]); // อัปเดตพิกัดแผนที่

        const forecastResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=8b35135ee79e413bbaf7af96a83ff742&units=metric`
        );
        setHourlyData(forecastResponse.data);
      } catch (error) {
        console.error('Error fetching weather data', error);
      }
    };

    fetchWeatherData();
  }, [city]); // ดึงข้อมูลทุกครั้งเมื่อ `city` เปลี่ยนแปลง

  // เตรียมข้อมูลสำหรับแสดงกราฟพยากรณ์รายชั่วโมง
  const chartData = hourlyData
    ? {
        labels: hourlyData.list.slice(0, 10).map((data) => new Date(data.dt * 1000).getHours() + ":00"), // แสดงเฉพาะชั่วโมง
        datasets: [
          {
            label: 'Temperature (°C)',
            data: hourlyData.list.slice(0, 10).map((data) => data.main.temp), // อุณหภูมิรายชั่วโมง
            fill: false,
            borderColor: 'rgba(75,192,192,1)',
            tension: 0.1,
          },
        ],
      }
    : null;

  return (
    <Container fluid className="bg-light" style={{ minHeight: "100vh", padding: "20px" }}>
      {/* ปุ่มย้อนกลับที่มุมซ้ายบน */}
      <div className="row d-flex justify-content-start m-4 col-1" style={{ zIndex: 999 }}>
        <Button variant="outline-primary" onClick={handleGoBack} className="shadow-sm">
          Go Back
        </Button>
      </div>

      <Container className="h-100">
        <Row className="h-100">
          {weatherData ? (
            <>
              <Col md={6} className="d-flex align-items-center">
                <Card className="text-center shadow-lg w-100 p-4 mb-5 bg-white rounded">
                  <Card.Body>
                    <Card.Title>
                      <h1 className="font-weight-bold">
                        Weather in <span className="text-primary">{weatherData.name}</span>
                      </h1>
                    </Card.Title>
                    <Card.Text>
                      <img
                        src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                        alt="Weather Icon"
                        className="my-3"
                      />
                      <strong>Temperature:</strong> {weatherData.main.temp} °C <br />
                      <strong>Weather:</strong> {weatherData.weather[0].description} <br />
                      <strong>Humidity:</strong> {weatherData.main.humidity}% <br />
                      <strong>Wind Speed:</strong> {weatherData.wind.speed} m/s
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>

              {/* ส่วนของแผนที่ */}
              <Col md={6} className="d-flex align-items-center justify-content-center">
                <MapContainer center={coords} zoom={10} style={{ height: '400px', width: '100%' }} className="shadow-lg rounded">
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={coords}>
                    <Popup>{weatherData.name}</Popup>
                  </Marker>
                </MapContainer>
              </Col>

              {/* ส่วนของการพยากรณ์รายชั่วโมง */}
              <Col xs={12} className="mt-5">
                <h3 className="text-center">Hourly forecast</h3>
                {chartData ? (
                  <div className="chart-container shadow-lg p-4 bg-white rounded">
                    <Line data={chartData} />
                  </div>
                ) : (
                  <p className="text-center">Loading hourly forecast...</p>
                )}
              </Col>
            </>
          ) : (
            <p className="text-center">Loading weather data...</p>
          )}
        </Row>
      </Container>
    </Container>
  );
};

export default WeatherPage;

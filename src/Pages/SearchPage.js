import React, { useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import cities from '../cities.json'; // Import ข้อมูลจาก cities.json

const SearchPage = () => {
    const [weatherData, setWeatherData] = useState(null);
    const [coords, setCoords] = useState([13.7563, 100.5018]); // Default to Bangkok's coordinates
    const [selectedCity, setSelectedCity] = useState(null); // เก็บข้อมูลเมืองที่เลือก
    const navigate = useNavigate(); // ใช้ useNavigate เพื่อนำทางไปหน้าอื่น

    // ฟังก์ชันเลือกเมืองและอัปเดตพิกัด
    const handleCitySelect = async (cityName, lat, lon) => {
        try {
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=8b35135ee79e413bbaf7af96a83ff742&units=metric`
            );
            setWeatherData(response.data); // แสดงผลสภาพอากาศของเมืองที่เลือก
            setCoords([lat, lon]); // อัปเดตพิกัดของแผนที่ให้ชี้ไปที่เมืองที่เลือก
            setSelectedCity(cityName); // เก็บชื่อเมืองที่เลือกเพื่อใช้แสดงใน Marker

            // นำทางไปยังหน้าแสดงสภาพอากาศ
            navigate(`/weather/${cityName}`);
        } catch (error) {
            console.error("Error fetching weather data", error);
        }
    };

    return (
        <Container fluid className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
            <Row className="w-100 justify-content-center">
                <Col md={8} lg={6}>
                    <Card className="shadow-lg p-4" style={{ backgroundColor: '#f8f9fa' }}>
                        <Card.Body>
                            <h3 className="text-center mb-4">Select a City in Thailand</h3>
                            <Row className="justify-content-center">
                                {cities.map((city) => (
                                    <Col key={city.id} md={6} className="mb-3">
                                        <Card className="text-center h-100">
                                            <Card.Body>
                                                <Card.Title>{city.name}</Card.Title>
                                                <Button
                                                    variant="primary"
                                                    onClick={() => handleCitySelect(city.name, city.lat, city.lon)}>
                                                    View Weather
                                                </Button>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default SearchPage;

import React from 'react';
import {
    Box,
    Card,
    Typography,
    IconButton,
    Chip,
    Button,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import AddIcon from '@mui/icons-material/Add';
import './Cards.css';
import { useAuth } from '../../context/AuthContext';

const Cards = () => {
    const [showCardNumber, setShowCardNumber] = React.useState(false);
    const { username } = useAuth();

    // Card data
    const card = {
        id: 1,
        type: 'Mastercard',
        cardNumber: '5555 4444 3333 2222',
        expiryDate: '12/28',
        cardHolder: (username || 'Card Holder').toUpperCase(),
        balance: 5280.50,
        color: 'gradient-blue'
    };

    const toggleCardNumber = () => {
        setShowCardNumber(!showCardNumber);
    };

    const maskCardNumber = (number: string) => {
        return `•••• •••• •••• ${number.slice(-4)}`;
    };

    return (
        <div className="cards-container">
            
            <Box className="cards-grid">
                <Card 
                    className={`card-item ${card.color} card-design`}
                >
                    <div className="card-decor" />
                    <div className="card-content">
                        <div className="card-top">
                            <Typography variant="h6" className="card-type">
                                {card.type}
                            </Typography>
                            <div className="mastercard-logo">
                                <div className="mastercard-circle mastercard-circle-1"></div>
                                <div className="mastercard-circle mastercard-circle-2"></div>
                            </div>
                        </div>

                        <div className="card-row">
                            <div className="chip" />
                            <div className="contactless">
                                <span />
                                <span />
                                <span />
                            </div>
                        </div>

                        <div className="card-number">
                            <Typography variant="h5" className={!showCardNumber ? 'blurred-text' : ''}>
                                {card.cardNumber}
                            </Typography>
                            <IconButton 
                                onClick={toggleCardNumber}
                                className="visibility-toggle"
                            >
                                {showCardNumber ? 
                                    <VisibilityOffOutlinedIcon /> : 
                                    <VisibilityOutlinedIcon />
                                }
                            </IconButton>
                        </div>

                        <div className="card-details">
                            <div className="expiry-date">
                                <Typography variant="caption">Expiry Date</Typography>
                                <Typography className={!showCardNumber ? 'blurred-text' : ''}>{card.expiryDate}</Typography>
                            </div>
                            <div className="card-holder">
                                <Typography variant="caption">Card Holder</Typography>
                                <Typography>{card.cardHolder}</Typography>
                            </div>
                        </div>

                        {/* Balance section intentionally removed */}
                    </div>
                </Card>
            </Box>

            <Box className="cards-actions">
                <Typography className="security-note">
                    🔒 Your card details are encrypted and secure
                </Typography>
            </Box>
        </div>
    );
};

export default Cards;

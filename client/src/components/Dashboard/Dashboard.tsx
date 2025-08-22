import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, IconButton, Badge } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useAccounts } from '../../context/AccountContext';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const { username } = useAuth();
  // Convert currency to formatted string
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const [showSavings, setShowSavings] = useState(false);
  const [showChecking, setShowChecking] = useState(false);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Dark Blue Header */}
      <Box
        sx={{
          bgcolor: '#1e3a8a', // Dark blue
          color: 'white',
          px: 3,
          py: 4,
          pb: 8,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        {/* Brand Logo and Info - Left Side */}
        <Box sx={{ position: 'absolute', top: 8, left: 16, textAlign: 'left' }}>
          <Box
            component="img"
            src="/logo.png"
            alt="Logo"
            sx={{
              width: 48,
              height: 48,
              filter: 'brightness(0) invert(1)', // Makes logo white
              mb: 0.5,
            }}
          />
          <Typography
            variant="body2"
            sx={{
              color: 'white',
              fontWeight: 600,
              fontSize: '0.875rem',
            }}
          >
            {`Welcome back, ${username || 'User'} 👋`}
          </Typography>
        </Box>

        {/* Notification Bell */}
        <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
          <IconButton sx={{ color: 'white' }}>
            <Badge badgeContent={3} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Box>
      </Box>

      {/* Main Content Area - Proper spacing from header */}
      <Box
        sx={{
          px: 3,
          pb: 10, // Space for bottom navigation
          mt: 4, // Reduced margin to bring cards closer but not touching header
        }}
      >
        {/* Account Cards Container */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%' }}>
          {/* Savings Account Card */}
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              border: '1px solid rgba(0,0,0,0.06)',
              width: '100%',
              maxWidth: '100%',
            }}
          >
            <CardContent
              sx={{
                p: 3,
                borderLeft: '4px solid #10b981', // Green accent
                pl: 3,
                width: '100%',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: '#1f2937',
                    fontSize: '1.125rem',
                  }}
                >
                  Savings Account ...9012
                </Typography>
                <IconButton aria-label={showSavings ? 'Hide balance' : 'Show balance'} onClick={() => setShowSavings((v) => !v)}>
                  {showSavings ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </Box>
              <Typography
                variant="body2"
                sx={{
                  mb: 3,
                  color: '#6b7280',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                }}
              >
                Account No. ...9012
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  mb: 1,
                  fontWeight: 800,
                  color: '#111827',
                  letterSpacing: '-0.025em',
                  fontSize: { xs: '2rem', sm: '2.5rem' },
                  lineHeight: 1.1,
                }}
              >
                {showSavings ? formatCurrency(243455.75) : '••••••'}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#6b7280',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                }}
              >
                {showSavings ? 'Available Balance' : 'Hidden'}
              </Typography>
            </CardContent>
          </Card>

          {/* Checking Account Card */}
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              border: '1px solid rgba(0,0,0,0.06)',
              width: '100%',
              maxWidth: '100%',
            }}
          >
            <CardContent
              sx={{
                p: 3,
                borderLeft: '4px solid #f59e0b', // Amber/orange accent
                pl: 3,
                width: '100%',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: '#1f2937',
                    fontSize: '1.125rem',
                  }}
                >
                  Checking Account
                </Typography>
                <IconButton aria-label={showChecking ? 'Hide balance' : 'Show balance'} onClick={() => setShowChecking((v) => !v)}>
                  {showChecking ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </Box>
              <Typography
                variant="body2"
                sx={{
                  mb: 3,
                  color: '#6b7280',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                }}
              >
                Account No. ...1098
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  mb: 1,
                  fontWeight: 800,
                  color: '#111827',
                  letterSpacing: '-0.025em',
                  fontSize: { xs: '2rem', sm: '2.5rem' },
                  lineHeight: 1.1,
                }}
              >
                {showChecking ? formatCurrency(37230.00) : '••••••'}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#6b7280',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                }}
              >
                {showChecking ? 'Available Balance' : 'Hidden'}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;

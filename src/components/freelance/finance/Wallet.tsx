import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Grid, 
  Button, 
  TextField, 
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { formater } from "@/components/format/Currency";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
}

const WalletPage: React.FC = () => {
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => {
      setBalance(1250.75);
      setTransactions([
        { id: '1', date: '2024-08-28', amount: 100, type: 'credit', description: 'Ride completed' },
        { id: '2', date: '2024-08-27', amount: 75.50, type: 'credit', description: 'Ride completed' },
        { id: '3', date: '2024-08-26', amount: 50, type: 'debit', description: 'Withdrawal' },
      ]);
      setIsLoading(false);
    }, 1500);
  }, []);

  const handleWithdraw = () => {
    // Logique de retrait à implémenter
    console.log(`Retrait de ${withdrawAmount}€ demandé`);
  };

  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Daily income',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        // Ajoutez ces données pour l'historique des gains
        history: [
          ['Ride 1: 30 XAF', 'Ride 2: 35 XAF'],
          ['Ride 1: 59 XAF'],
          ['Ride 1: 40 XAF', 'Ride 2: 40 XAF'],
          ['Ride 1: 81 XAF'],
          ['Ride 1: 56 XAF'],
          ['Ride 1: 25 XAF', 'Ride 2: 30 XAF'],
          ['Ride 1: 40 XAF'],
        ],
      },
      {
        label: 'Daily expense',
        data: [0, 10, 30, 100, 0, 42, 23],
        fill: false,
        borderColor: 'rgb(255, 80, 75)',
        tension: 0.1,
        // Ajoutez ces données pour l'historique des dépenses
        history: [
          [],
          ['Frais 1: 10 XAF'],
          ['Frais 1: 15 XAF', 'Frais 2: 15 XAF'],
          ['Frais 1: 100 XAF'],
          [],
          ['Frais 1: 42 XAF'],
          ['Frais 1: 23 XAF'],
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          afterBody: function(context:any) {
            const dataIndex = context[0].dataIndex;
            const datasetIndex = context[0].datasetIndex;
            const history = chartData.datasets[datasetIndex].history[dataIndex];
            return history.length > 0 ?  history.join('\n') : '';
          }
        }
      }
    },
    scales: {
      y: {
        ticks: {
          callback: function(value:any, index:any, values:any) {
            return formater(value) + ' XAF';
          }
        }
      }
    }
  };


  if (isLoading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography  gutterBottom variant="h6">
          My Wallet
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8} lg={9}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" gutterBottom>
                Weekly Incomes
              </Typography>
              <Line data={chartData} options={chartOptions} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" gutterBottom>
                Balance
              </Typography>
              <Typography variant="h6" component="p">
                {formater(balance)} XAF
              </Typography>
              <TextField
                label="withdrawal amount"
                variant="outlined"
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                sx={{ mt: 2 }}
              />
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleWithdraw}
                sx={{ mt: 2 }}
              >
                Withdraw
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" gutterBottom>
                Transaction history
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell align="right">Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell align="right" sx={{ color: transaction.type === 'credit' ? 'green' : 'red' }}>
                          {transaction.type === 'credit' ? '+' : '-'}{formater(transaction.amount)} XAF
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default WalletPage;
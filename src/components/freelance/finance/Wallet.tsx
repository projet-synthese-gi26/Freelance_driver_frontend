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
import { formater } from "@/components/format/Currency";

import { walletService, WalletTransaction } from '@/service/walletService';

const WalletPage: React.FC = () => {
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [rechargeAmount, setRechargeAmount] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setIsLoading(true);
        const [wallet, txns] = await Promise.all([
          walletService.getMyWallet(),
          walletService.getMyTransactions(),
        ]);

        if (!mounted) return;
        setBalance(Number(wallet.balance ?? 0));
        setTransactions(txns);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const handleRecharge = async () => {
    const parsed = Number(rechargeAmount);
    if (!Number.isFinite(parsed) || parsed <= 0) return;

    try {
      setIsSubmitting(true);
      await walletService.recharge(parsed);
      const [wallet, txns] = await Promise.all([
        walletService.getMyWallet(),
        walletService.getMyTransactions(),
      ]);
      setBalance(Number(wallet.balance ?? 0));
      setTransactions(txns);
      setRechargeAmount('');
    } finally {
      setIsSubmitting(false);
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
          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" gutterBottom>
                Balance
              </Typography>
              <Typography variant="h6" component="p">
                {formater(balance)} XAF
              </Typography>
              <TextField
                label="recharge amount"
                variant="outlined"
                type="number"
                value={rechargeAmount}
                onChange={(e) => setRechargeAmount(e.target.value)}
                sx={{ mt: 2 }}
              />
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleRecharge}
                disabled={isSubmitting}
                sx={{ mt: 2 }}
              >
                Recharge
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
                      <TableCell>Type</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{transaction.type}</TableCell>
                        <TableCell>{transaction.status}</TableCell>
                        <TableCell align="right">
                          {formater(Number(transaction.amount ?? 0))} XAF
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
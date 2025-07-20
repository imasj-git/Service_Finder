
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../ui/table';
import { Search, Download, CreditCard, DollarSign, TrendingUp, Clock } from 'lucide-react';

const Payments = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const transactions = [
    {
      id: 'TXN001',
      customer: 'John Smith',
      provider: 'Mike Johnson',
      service: 'Plumbing',
      amount: '$120',
      customerPayment: '$120',
      providerPayout: '$102',
      commission: '$18',
      date: '2024-01-15',
      status: 'Completed'
    },
    {
      id: 'TXN002',
      customer: 'Sarah Wilson',
      provider: 'Tom Brown',
      service: 'Electrical',
      amount: '$95',
      customerPayment: '$95',
      providerPayout: '$80.75',
      commission: '$14.25',
      date: '2024-01-16',
      status: 'Pending'
    },
    {
      id: 'TXN003',
      customer: 'David Lee',
      provider: 'Lisa Green',
      service: 'Gardening',
      amount: '$80',
      customerPayment: '$80',
      providerPayout: '$68',
      commission: '$12',
      date: '2024-01-17',
      status: 'Processing'
    },
    {
      id: 'TXN004',
      customer: 'Emily Davis',
      provider: 'Chris White',
      service: 'Painting',
      amount: '$200',
      customerPayment: '$200',
      providerPayout: '$170',
      commission: '$30',
      date: '2024-01-18',
      status: 'Completed'
    },
  ];

  const filteredTransactions = transactions.filter(transaction =>
    transaction.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Processing':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payment & Transactions</h1>
        <p className="text-gray-600">Manage payments and provider payouts</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">$125,430</p>
                <p className="text-sm text-green-600">+12% from last month</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Provider Payouts</p>
                <p className="text-2xl font-bold text-blue-600">$98,240</p>
                <p className="text-sm text-blue-600">+8% from last month</p>
              </div>
              <CreditCard className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Commission Earned</p>
                <p className="text-2xl font-bold text-purple-600">$27,190</p>
                <p className="text-sm text-purple-600">+15% from last month</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Payouts</p>
                <p className="text-2xl font-bold text-yellow-600">$5,420</p>
                <p className="text-sm text-gray-600">24 transactions</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Transaction History</CardTitle>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">Filter by Date</Button>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Provider Payout</TableHead>
                  <TableHead>Commission</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">{transaction.id}</TableCell>
                    <TableCell>{transaction.customer}</TableCell>
                    <TableCell>{transaction.provider}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{transaction.service}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{transaction.amount}</TableCell>
                    <TableCell className="text-blue-600">{transaction.providerPayout}</TableCell>
                    <TableCell className="text-purple-600">{transaction.commission}</TableCell>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {transaction.status === 'Pending' && (
                          <Button size="sm" className="bg-brand-600 hover:bg-brand-700">
                            Process
                          </Button>
                        )}
                        <Button size="sm" variant="ghost">
                          View
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Payments;

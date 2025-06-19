// import { useEffect, useState } from 'react';
// import { fetchDashboardOverview } from '@/services/dashboardService';
// import Protected from '@/components/Protected';
// import DashboardLayout from '@/components/DashboardLayout';
// import { useAtomValue } from 'jotai';
// import { tokenAtom, userAtom } from '@/store/atoms';
// import {
//   Grid,
//   Card,
//   CardContent,
//   Typography,
//   Container,
//   Box,
//   ButtonGroup,
//   Button,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   useTheme
// } from '@mui/material';
// import { BarChart, LineChart } from '@mui/x-charts';

// export default function OverviewPage() {
//   const user = useAtomValue(userAtom);
//   const token = useAtomValue(tokenAtom);
//   const theme = useTheme();
//   const isManager = user?.role === 'manager';
//   const [data, setData] = useState(null);

//   useEffect(() => {
//     if (user?.restaurantId) {
//       fetchDashboardOverview()
//         .then(setData)
//         .catch((err) => console.error('Dashboard fetch error:', err.message));
//     }
//   }, [user]);

//   if (!user || !token || !data) return null;

//   return (
//     <Protected>
//       <DashboardLayout>
//         <Container maxWidth="xl">
//           <Grid container spacing={3}>
//             {isManager && (
//               <>
//                 <Grid xs={12} sm={6} md={4}>
//                   <Card sx={{ backgroundColor: '#e3f2fd', height: 160 }}>
//                     <CardContent>
//                       <Typography variant="subtitle2" color="text.secondary">TOTAL REVENUE</Typography>
//                       <Typography variant="h4" fontWeight="bold">${data.totalRevenue?.toFixed(2) || 0}</Typography>
//                       <Typography color="text.secondary" variant="body2" mt={1}>Last 7 days</Typography>
//                     </CardContent>
//                   </Card>
//                 </Grid>

//                 <Grid xs={12} sm={6} md={4}>
//                   <Card sx={{ backgroundColor: '#fce4ec', height: 160 }}>
//                     <CardContent>
//                       <Typography variant="subtitle2" color="text.secondary">ORDERS</Typography>
//                       <Typography variant="h4" fontWeight="bold">{data.totalOrders || 0}</Typography>
//                       <Typography color="text.secondary" variant="body2" mt={1}>Processed this week</Typography>
//                     </CardContent>
//                   </Card>
//                 </Grid>

//                 <Grid xs={12} sm={6} md={4}>
//                   <Card sx={{ backgroundColor: '#ede7f6', height: 160 }}>
//                     <CardContent>
//                       <Typography variant="subtitle2" color="text.secondary">ACTIVE EMPLOYEES</Typography>
//                       <Typography variant="h4" fontWeight="bold">{data.totalStaff || 0}</Typography>
//                       <Typography color="text.secondary" variant="body2" mt={1}>Across all shifts</Typography>
//                     </CardContent>
//                   </Card>
//                 </Grid>

//                 <Grid xs={12} sm={6} md={4}>
//                   <Card sx={{ backgroundColor: '#fff8e1', height: 160 }}>
//                     <CardContent>
//                       <Typography variant="subtitle2" color="text.secondary">INVENTORY ALERTS</Typography>
//                       <Typography variant="h4" fontWeight="bold">{data.inventoryAlerts?.length ?? 0}</Typography>
//                       <Typography color="text.secondary" variant="body2" mt={1}>Below threshold</Typography>
//                     </CardContent>
//                   </Card>
//                 </Grid>

//                 <Grid xs={12} sm={6} md={4}>
//                   <Card sx={{ backgroundColor: '#e0f7fa', height: 160 }}>
//                     <CardContent>
//                       <Typography variant="subtitle2" color="text.secondary">UPCOMING SHIFTS</Typography>
//                       <Typography variant="h4" fontWeight="bold">{data.upcomingShifts?.length ?? 0}</Typography>
//                       <Typography color="text.secondary" variant="body2" mt={1}>Scheduled today</Typography>
//                     </CardContent>
//                   </Card>
//                 </Grid>

//                 {/* 📊 Charts */}
//                 <Grid xs={12} container spacing={3}>
//                   {data.revenueChart?.length > 0 && (
//                     <Grid xs={12} md={6}>
//                       <Card sx={{ boxShadow: 3 }}>
//                         <CardContent>
//                           <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
//                             <Typography variant="h6">📈 Overview</Typography>
//                             <ButtonGroup variant="outlined" size="small">
//                               <Button>Month</Button>
//                               <Button>Week</Button>
//                             </ButtonGroup>
//                           </Box>
//                           <LineChart
//                             height={260}
//                             series={[{ data: data.revenueChart, label: 'Revenue ($)' }]}
//                             xAxis={[{ scaleType: 'point', data: data.revenueLabels }]}
//                             colors={[theme.palette.primary.main]}
//                           />
//                         </CardContent>
//                       </Card>
//                     </Grid>
//                   )}

//                   {data.orderChart?.length > 0 && (
//                     <Grid xs={12} md={6}>
//                       <Card sx={{ boxShadow: 3 }}>
//                         <CardContent>
//                           <Typography variant="h6" mb={2}>📊 Total Orders</Typography>
//                           <BarChart
//                             height={260}
//                             xAxis={[{ scaleType: 'band', data: data.orderLabels }]}
//                             series={[{ data: data.orderChart, label: 'Orders' }]}
//                             colors={['#ef5350']}
//                           />
//                         </CardContent>
//                       </Card>
//                     </Grid>
//                   )}
//                 </Grid>
//               </>
//             )}

//             {/* Staff View */}
//             {!isManager && (
//               <Grid xs={12}>
//                 <Card>
//                   <CardContent>
//                     <Typography variant="h6">🗓️ My Schedule</Typography>
//                     <Table size="small">
//                       <TableHead>
//                         <TableRow>
//                           <TableCell>Day</TableCell>
//                           <TableCell>Shift</TableCell>
//                           <TableCell>Role</TableCell>
//                         </TableRow>
//                       </TableHead>
//                       <TableBody>
//                         {data.staffSchedule?.map((s, idx) => (
//                           <TableRow key={idx}>
//                             <TableCell>{s.day}</TableCell>
//                             <TableCell>{s.shift}</TableCell>
//                             <TableCell>{s.role}</TableCell>
//                           </TableRow>
//                         ))}
//                       </TableBody>
//                     </Table>
//                   </CardContent>
//                 </Card>
//               </Grid>
//             )}
//           </Grid>
//         </Container>
//       </DashboardLayout>
//     </Protected>
//   );
// }
// pages/[restaurantUsername]/dashboard/index.js
import DashboardLayout from "@/components/DashboardLayout";
import Protected from "@/components/Protected";

export default function OverviewPage() {
  return (
    <Protected>
      <DashboardLayout>
        {}
      </DashboardLayout>
    </Protected>
  );
}


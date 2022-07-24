import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Legend, Tooltip, } from "chart.js";
import { useAxios } from '../../../../utils/useAxios';
import { Typography } from '@mui/material';
import LoadingPage from '../../LoadingPage';

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip
)

export default function BarChart() {

  const { response, error } = useAxios({
    method: 'GET',
    url: '/contestant/contestant/votes'
  });

  const data ={
    labels: response?.map((data: { username: string; }) => data.username.toUpperCase()),
    datasets: [{
      label: 'Votes',
      data: response?.map((data: { vote: number; }) => data.vote),
      backgroundColor: [
        'rgba(21, 2, 58, 0.7)'
      ],
      borderColor: [
        'rgba(21, 2, 58, 1)'
      ],
      borderWidth: 1
    }],
  }

  const options: any = {
    maintainAspectRadio: false,
    scales: {
      y: {
        beginAtZero: true
      }
    },
    tooltip: {
      mode: 'index'
    },
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        display: true
      },
      title: {
        display: true,
        text: 'Charts of students'
      }
    }
  }

  return (
    <div>
      {error ? (<Typography variant="h4" sx={{color: "red"}}>{error}</Typography>) : (<Bar
        data={data}
        height={100}
        options={options}
      /> )}
    </div>
  )
}

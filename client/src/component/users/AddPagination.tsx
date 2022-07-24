import { Box } from '@mui/material';
import ReactPaginate from 'react-paginate';
import '../../App.css'

interface DataProps {
  data: any,
  itemsPerPage: number,
  pageCount: number,
  setValues: any,
  values: any
}
export default function AddPagination({data, itemsPerPage, pageCount, setValues, values}: DataProps) {

  const handlePageClick = (event: any) => {
    const newOffset = (event.selected * itemsPerPage) % data.length;
    setValues({...values, itemOffset: newOffset})
  };

  return (
    <Box sx={{overflow: "hidden"}}>
      <ReactPaginate
        breakLabel="..."
        nextLabel="next >>"
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        pageCount={pageCount}
        previousLabel="<< prev"
        containerClassName="pagination"
        pageLinkClassName="page-num"
        previousLinkClassName="page-num"
        nextLinkClassName="page-num"
        activeLinkClassName="active"
      />
    </Box>
  );
}

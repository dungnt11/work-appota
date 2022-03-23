export const getStatusOrderBy = (ord: number): string => {
  switch (ord) {
    case 0:
      return 'DESC';
    case 1:
      return 'ASC';
  
    default:
      return 'ASC';
  }
}
interface param{
    data:any,
    filename:string
}

export const exportToCSV = ({data,filename}:param) => {
    const csvContent=convertToCSV(data);
    const blob=new Blob([csvContent],{type:'text/csv;charset=utf-8'});
    const url=URL.createObjectURL(blob)
    const link=document.createElement('a');
    link.href=url
    link.setAttribute('download',`${filename}-${new Date().toLocaleDateString()}.csv`);
    link.click();
}

function convertToCSV(data:any) {
    const headers = Object.keys(data[0]);
    const rows=data.map((item:any) => headers.map((header) => item[header]));
    const headerRow=headers.join(',');
    const csvRows=[headerRow,...rows.map((row:any) => row.join(','))];
    return csvRows.join('\n'); 
}
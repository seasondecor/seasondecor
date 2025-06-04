import { StyleSheet } from '@react-pdf/renderer';

// Create more compact PDF styles
export const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: '#ffffff',
      padding: 20,
    },
    header: {
      marginBottom: 10,
      padding: 8,
      backgroundColor: '#2563eb',
      color: 'white',
      borderRadius: 5,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: 'white',
      marginBottom: 3,
    },
    subtitle: {
      fontSize: 12,
      color: 'white',
    },
    content: {
      margin: 8,
      padding: 8,
    },
    section: {
      marginBottom: 10,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      marginBottom: 6,
      color: '#333',
      paddingBottom: 3,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
    },
    text: {
      fontSize: 10,
      marginBottom: 3,
      color: '#333',
    },
    table: {
      display: 'flex',
      width: 'auto',
      borderStyle: 'solid',
      borderColor: '#bfbfbf',
      borderWidth: 1,
      borderRightWidth: 0,
      borderBottomWidth: 0,
      marginVertical: 8,
    },
    tableRow: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: '#bfbfbf',
      minHeight: 18,
    },
    tableHeader: {
      backgroundColor: '#f0f0f0',
    },
    tableCell: {
      flex: 1,
      padding: 3,
      borderRightWidth: 1,
      borderRightColor: '#bfbfbf',
      fontSize: 8,
    },
    tableCellDescription: {
      flex: 3,
    },
    tableCellPrice: {
      flex: 1,
    },
    tableCellQuantity: {
      flex: 1,
    },
    tableCellAmount: {
      flex: 1,
    },
    total: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: 10,
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: '#eee',
    },
    totalLabel: {
      fontSize: 12,
      fontWeight: 'bold',
      marginRight: 8,
    },
    totalValue: {
      fontSize: 12,
      fontWeight: 'bold',
    },
    footer: {
      position: 'absolute',
      bottom: 20,
      left: 20,
      right: 20,
      textAlign: 'center',
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: '#eee',
      fontSize: 8,
      color: '#666',
    },
  });
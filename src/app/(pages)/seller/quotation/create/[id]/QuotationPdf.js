'use client';

import React, { useState, useEffect } from 'react';
import { PDFViewer, PDFDownloadLink, Document, Page, Text, View, pdf, Image } from '@react-pdf/renderer';
import Button from "@/app/components/ui/Buttons/Button";
import { IoDownloadOutline } from "react-icons/io5";
import { styles as baseStyles } from '../../style';

// Enhanced styles for a more attractive PDF
const styles = {
  ...baseStyles,
  page: {
    ...baseStyles.page,
    padding: 20,
    backgroundColor: '#fff',
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderBottom: '3px solid #FF385C',
    paddingBottom: 5,
  },
  logo: {
    width: 100,
    height: 40,
    objectFit: 'contain',
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF385C',
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 11,
    color: '#666',
    marginTop: 3,
  },
  section: {
    ...baseStyles.section,
    marginBottom: 8,
    padding: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
    borderLeft: '4px solid #FF385C',
  },
  sectionTitle: {
    ...baseStyles.sectionTitle,
    fontSize: 14,
    color: '#333',
    borderBottom: '1px solid #ddd',
    paddingBottom: 5,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  text: {
    ...baseStyles.text,
    fontSize: 9,
    lineHeight: 1.4,
    color: '#444',
  },
  tableContainer: {
    ...baseStyles.tableContainer,
    marginTop: 5,
    marginBottom: 5,
  },
  tableTitle: {
    ...baseStyles.tableTitle,
    color: '#FF385C',
    fontWeight: 'bold',
    fontSize: 12,
    marginBottom: 4,
  },
  table: {
    ...baseStyles.table,
    borderRadius: 5,
    overflow: 'hidden',
    border: '1px solid #eaeaea',
  },
  tableHeader: {
    ...baseStyles.tableHeader,
    backgroundColor: '#FF385C',
    color: '#fff',
    minHeight: 20,
  },
  tableRow: {
    ...baseStyles.tableRow,
    minHeight: 24,
    borderBottomColor: '#e1e1e1',
  },
  tableCell: {
    ...baseStyles.tableCell,
    padding: 5,
    fontSize: 8,
  },
  noteCell: {
    ...baseStyles.tableCell,
    padding: 5,
    fontSize: 8,
    maxWidth: 120,
    wordWrap: 'break-word',
    whiteSpace: 'pre-wrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  subtotal: {
    ...baseStyles.subtotal,
    backgroundColor: '#f5f5f5',
    padding: 6,
    marginTop: 4,
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  total: {
    ...baseStyles.total,
    marginTop: 10,
    padding: 8,
    backgroundColor: '#FF385C',
    color: 'white',
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalLabel: {
    ...baseStyles.totalLabel,
    fontSize: 11,
    fontWeight: 'bold',
  },
  totalValue: {
    ...baseStyles.totalValue,
    fontSize: 11,
    fontWeight: 'bold',
  },
  infoBox: {
    flexDirection: 'row',
    marginBottom: 8,
    borderRadius: 5,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eaeaea',
  },
  infoColumn: {
    flex: 1,
    padding: 8,
  },
  infoLabel: {
    fontSize: 7,
    color: '#777',
    marginBottom: 1,
  },
  infoValue: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#333',
  },
  footer: {
    ...baseStyles.footer,
    marginTop: 20,
    paddingTop: 10,
    borderTop: '2px solid #eaeaea',
    alignItems: 'center',
    paddingBottom: 0,
  },
  footerText: {
    color: '#666',
    fontSize: 8,
    marginBottom: 2,
  },
  highlight: {
    color: '#FF385C',
    fontWeight: 'bold',
  },
  infoGroup: {
    marginTop: 3,
  },
  compactRows: {
    maxHeight: 150,
  },
  termsText: {
    fontSize: 9,
    lineHeight: 1.4,
    color: '#444',
    marginTop: 3,
  }
};

// Create a local currency formatter function that works with PDF
const formatVND = (value) => {
  // First ensure the value is a valid number
  console.log("Formatting raw value:", value, "type:", typeof value);
  
  // Special handling for formatted strings with dots or commas
  let numValue;
  if (typeof value === 'string') {
    // Remove all dots and commas, then parse
    const cleanStr = value.replace(/[.,\s]/g, '');
    numValue = parseFloat(cleanStr);
    console.log("Cleaned string:", cleanStr, "parsed as:", numValue);
  } else if (typeof value === 'number') {
    numValue = value;
  } else {
    numValue = 0;
  }
  
  // Handle non-numeric or NaN values
  if (isNaN(numValue)) numValue = 0;
  
  console.log("Final formatted value:", numValue);
  
  // Format as Vietnamese Dong with space before VND
  return new Intl.NumberFormat('vi-VN', {
    style: 'decimal',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0
  }).format(numValue) + ' VND';
};

// Helper function to parse potentially formatted number strings
const parseFormattedNumber = (value) => {
  if (typeof value === 'number') return value;
  if (!value && value !== 0 && value !== '0') return 0;
  
  // First convert to string and log value type and content
  const stringValue = value.toString();
  console.log(`PDF parsing value: "${stringValue}" (${typeof value})`);
  
  // Special case for Input formatPrice values
  // If the value is numeric digits only, we need to use it directly
  if (/^\d+$/.test(stringValue)) {
    const numericValue = parseInt(stringValue, 10);
    console.log(`Direct numeric value: ${numericValue}`);
    return numericValue;
  }
  
  // Handle numbers that might be formatted with dots as thousand separators (Vietnamese format)
  // For example: "1.000.000" → 1000000
  const cleanStr = stringValue.replace(/[.,\s]/g, '');
  const result = parseFloat(cleanStr);
  
  // Log the parsing result
  console.log(`PDF parsed result: ${result}`);
  
  return isNaN(result) ? 0 : result;
};

// Create the PDF Document component
const QuotationDocument = ({ data = {} }) => {
  // Log the incoming data to debug
  console.log("PDF Document received data:", data);
  
  // Safe data extraction with defaults
  const {
    quotationCode = 'N/A',
    customerName = 'N/A',
    customerEmail = 'N/A',
    customerPhone = 'N/A',
    terms = 'Standard terms apply',
    materials = [],
    constructionTasks = [],
    depositPercentage = 20,
    logoUrl = '/logo/logo-white.png', // Default logo URL
    designName = 'Not specified',
    themeColors = [],
    spaceType = 'Not specified',
    roomSize = 'Not specified',
    primaryUser = 'Not specified',
    scopeOfWorks = [],
    surveyDate = null
  } = data;

  // Ensure materials and constructionTasks are arrays
  const safetyMaterials = Array.isArray(materials) ? materials : [];
  const safetyTasks = Array.isArray(constructionTasks) ? constructionTasks : [];

  // Calculate total for materials
  const materialTotal = safetyMaterials.reduce((sum, item) => {
    // Parse cost and quantity, handling formatted strings
    const cost = parseFormattedNumber(item.cost);
    const quantity = parseFormattedNumber(item.quantity) || 1;
    
    console.log(`Material ${item.materialName}: raw cost=${item.cost}, parsed cost=${cost}, qty=${quantity}, total=${cost * quantity}`);
    
    return sum + (cost * quantity);
  }, 0);

  // Calculate total for construction tasks
  const constructionTotal = safetyTasks.reduce((sum, item) => {
    // Parse cost and area, handling formatted strings
    const cost = parseFormattedNumber(item.cost);
    const area = parseFormattedNumber(item.area);
    
    console.log(`Task ${item.taskName}: raw cost=${item.cost}, parsed cost=${cost}, area=${area}, total=${cost * area}`);
    
    return sum + (cost * area);
  }, 0);

  // Calculate grand total
  const grandTotal = materialTotal + constructionTotal;
  
  // Log the calculated totals
  console.log("PDF Calculated totals:", { materialTotal, constructionTotal, grandTotal });
  
  // Calculate deposit amount - ensure depositPercentage is a number
  const depositPercent = parseFloat(depositPercentage || 30);
  const depositAmount = grandTotal * (depositPercent / 100);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header with Logo */}
        <View style={styles.header}>
          <Image
            src={logoUrl || "/logo/logo-white.png"} 
            style={styles.logo}
            alt="logo"
          />
          <View style={styles.headerRight}>
            <Text style={styles.title}>QUOTATION #{quotationCode}</Text>
            <Text style={styles.subtitle}>Created: {new Date().toLocaleDateString()}</Text>
          </View>
        </View>

        {/* Client & Event Information - Enhanced with more fields */}
        <View style={styles.infoBox}>
          <View style={[styles.infoColumn, { backgroundColor: '#f9f9f9', flex: 1.2 }]}>
            <Text style={[styles.sectionTitle, { marginBottom: 5 }]}>Customer Details</Text>
            <View style={styles.infoGroup}>
              <Text style={styles.infoLabel}>Name</Text>
              <Text style={styles.infoValue}>{customerName}</Text>
            </View>
            <View style={styles.infoGroup}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{customerEmail}</Text>
            </View>
            <View style={styles.infoGroup}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{customerPhone || 'Not provided'}</Text>
            </View>
          </View>
          <View style={[styles.infoColumn, { backgroundColor: '#f5f5f5' }]}>
            <Text style={[styles.sectionTitle, { marginBottom: 5 }]}>Quotation Details</Text>
            <View style={styles.infoGroup}>
              <Text style={styles.infoLabel}>Created Date</Text>
              <Text style={styles.infoValue}>{new Date().toLocaleDateString()}</Text>
            </View>
            <View style={styles.infoGroup}>
              <Text style={styles.infoLabel}>Quotation Code</Text>
              <Text style={styles.infoValue}>{quotationCode}</Text>
            </View>
            <View style={styles.infoGroup}>
              <Text style={styles.infoLabel}>Survey Date</Text>
              <Text style={styles.infoValue}>
                {surveyDate ? new Date(surveyDate).toLocaleDateString() : 'Not scheduled'}
              </Text>
            </View>
          </View>
        </View>

        {/* Customer Preferences - More compact layout */}
        <View style={[styles.section, { marginBottom: 8 }]}>
          <Text style={[styles.sectionTitle, { color: '#333', marginBottom: 5 }]}>Customer Preferences</Text>
          
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {/* First row of preferences */}
            <View style={{ width: '33%' }}>
              <Text style={styles.infoLabel}>Design Style</Text>
              <Text style={[styles.infoValue, { fontSize: 8 }]}>{designName}</Text>
            </View>
            
            <View style={{ width: '33%' }}>
              <Text style={styles.infoLabel}>Theme Colors</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {themeColors && themeColors.length > 0 ? (
                  <>
                    {themeColors.map((color, index) => (
                      <View
                        key={`color-${index}`}
                        style={{
                          width: 8,
                          height: 8,
                          backgroundColor: color.colorCode,
                          marginRight: 3,
                          marginLeft: index > 0 ? 3 : 0,
                          borderRadius: 2,
                          border: '1px solid #ddd'
                        }}
                      />
                    ))}
                  </>
                ) : (
                  <Text style={[styles.infoValue, { fontSize: 8 }]}>None specified</Text>
                )}
              </View>
            </View>
            
            <View style={{ width: '33%' }}>
              <Text style={styles.infoLabel}>Space Type</Text>
              <Text style={[styles.infoValue, { fontSize: 8 }]}>{spaceType}</Text>
            </View>
            
            {/* Second row of preferences */}
            <View style={{ width: '33%', marginTop: 4 }}>
              <Text style={styles.infoLabel}>Room Size</Text>
              <Text style={[styles.infoValue, { fontSize: 8 }]}>
                {roomSize ? `${roomSize} m²` : 'Not specified'}
              </Text>
            </View>
            
            <View style={{ width: '33%', marginTop: 4 }}>
              <Text style={styles.infoLabel}>Primary User</Text>
              <Text style={[styles.infoValue, { fontSize: 8 }]}>{primaryUser}</Text>
            </View>
            
            <View style={{ width: '33%', marginTop: 4 }}>
              <Text style={styles.infoLabel}>Scope of Work</Text>
              <View>
                {Array.isArray(scopeOfWorks) && scopeOfWorks.length > 0 ? (
                  scopeOfWorks.map((work, index) => (
                    <Text key={`work-${index}`} style={[styles.infoValue, { fontSize: 8 }]}>
                      {work.workType || 'Not specified'}
                    </Text>
                  ))
                ) : (
                  <Text style={[styles.infoValue, { fontSize: 8 }]}>Not specified</Text>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* Service Details */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: '#FF385C', marginBottom: 5 }]}>Quotation Breakdown</Text>
          
          {/* Materials Table */}
          <View style={styles.tableContainer}>
            <Text style={styles.tableTitle}>Materials</Text>
            <View style={[styles.table, styles.compactRows]}>
              {/* Table Header */}
              <View style={[styles.tableRow, styles.tableHeader]}>
                <View style={[styles.tableCell, { flex: 2 }]}>
                  <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 7 }}>Material Name</Text>
                </View>
                <View style={[styles.tableCell, { flex: 1 }]}>
                  <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 7 }}>Note</Text>
                </View>
                <View style={[styles.tableCell, { flex: 0.5 }]}>
                  <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 7 }}>Quantity</Text>
                </View>
                <View style={[styles.tableCell, { flex: 1 }]}>
                  <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 7 }}>Cost</Text>
                </View>
              </View>
              
              {/* Materials Rows - more compact */}
              {safetyMaterials.length > 0 ? (
                safetyMaterials.slice(0, 3).map((item, index) => {
                  // Parse formatted numbers for display
                  const parsedCost = parseFormattedNumber(item.cost);
                  const isEvenRow = index % 2 === 0;
                  
                  return (
                    <View 
                      key={`material-${index}`} 
                      style={[
                        styles.tableRow, 
                        { backgroundColor: isEvenRow ? '#fff' : '#f5f9ff', minHeight: 20 }
                      ]}
                    >
                      <View style={[styles.tableCell, { flex: 2 }]}>
                        <Text style={{ fontSize: 7 }}>{item.materialName || 'N/A'}</Text>
                      </View>
                      <View style={[styles.noteCell, { flex: 1, fontSize: 7 }]}>
                        <Text style={{ fontSize: 7 }}>{item.note || 'N/A'}</Text>
                      </View>
                      <View style={[styles.tableCell, { flex: 0.5 }]}>
                        <Text style={{ fontSize: 7 }}>{item.quantity || 0}</Text>
                      </View>
                      <View style={[styles.tableCell, { flex: 1 }]}>
                        <Text style={{ fontSize: 7 }}>{formatVND(parsedCost)}</Text>
                      </View>
                    </View>
                  );
                })
              ) : (
                <View style={[styles.tableRow, { minHeight: 20 }]}>
                  <View style={[styles.tableCell, { flex: 6 }]}>
                    <Text style={{ fontSize: 7 }}>No materials added</Text>
                  </View>
                </View>
              )}
            </View>
            
            {/* Material Total */}
            <View style={styles.subtotal}>
              <Text style={styles.totalLabel}>Materials Total:</Text>
              <Text style={styles.totalValue}>{formatVND(materialTotal)}</Text>
            </View>
          </View>
          
          {/* Labour Tasks Table */}
          <View style={[styles.tableContainer, { marginTop: 5 }]}>
            <Text style={styles.tableTitle}>Labour Tasks</Text>
            <View style={[styles.table, styles.compactRows]}>
              {/* Table Header */}
              <View style={[styles.tableRow, styles.tableHeader]}>
                <View style={[styles.tableCell, { flex: 3 }]}>
                  <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 7 }}>Task Name</Text>
                </View>
                <View style={[styles.tableCell, { flex: 1.5 }]}>
                  <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 7 }}>Note</Text>
                </View>
                <View style={[styles.tableCell, { flex: 1 }]}>
                  <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 7 }}>Cost</Text>
                </View>
                <View style={[styles.tableCell, { flex: 0.8 }]}>
                  <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 7 }}>Unit</Text>
                </View>
                <View style={[styles.tableCell, { flex: 0.5 }]}>
                  <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 7 }}>Area</Text>
                </View>
              </View>
              
              {/* Labour Task Rows - more compact */}
              {safetyTasks.length > 0 ? (
                safetyTasks.slice(0, 3).map((item, index) => {
                  // Parse formatted numbers for display
                  const parsedCost = parseFormattedNumber(item.cost);
                  const parsedArea = parseFormattedNumber(item.area);
                  const totalCost = parsedCost * parsedArea;
                  const isEvenRow = index % 2 === 0;
                  
                  return (
                    <View 
                      key={`task-${index}`} 
                      style={[
                        styles.tableRow, 
                        { backgroundColor: isEvenRow ? '#fff' : '#f8f8f8', minHeight: 20 }
                      ]}
                    >
                      <View style={[styles.tableCell, { flex: 3 }]}>
                        <Text style={{ fontSize: 7 }}>{item.taskName || 'N/A'}</Text>
                      </View>
                      <View style={[styles.noteCell, { flex: 1.5 }]}>
                        <Text style={{ fontSize: 7 }}>
                          {item.note || 'N/A'}
                        </Text>
                      </View>
                      <View style={[styles.tableCell, { flex: 1 }]}>
                        <Text style={{ fontSize: 7 }}>{formatVND(parsedCost)}</Text>
                      </View>
                      <View style={[styles.tableCell, { flex: 0.8 }]}>
                        <Text style={{ fontSize: 7 }}>{item.unit || 'N/A'}</Text>
                      </View>
                      <View style={[styles.tableCell, { flex: 0.5 }]}>
                        <Text style={{ fontSize: 7 }}>{item.area || 0}</Text>
                      </View>
                    </View>
                  );
                })
              ) : (
                <View style={[styles.tableRow, { minHeight: 20 }]}>
                  <View style={[styles.tableCell, { flex: 6.6 }]}>
                    <Text style={{ fontSize: 7 }}>No labour tasks added</Text>
                  </View>
                </View>
              )}
            </View>
            
            {/* Labour Total */}
            <View style={styles.subtotal}>
              <Text style={styles.totalLabel}>Labour Task Total:</Text>
              <Text style={styles.totalValue}>{formatVND(constructionTotal)}</Text>
            </View>
          </View>

          {/* Grand Total and Deposit - Inline */}
          <View style={{flexDirection: 'row', justifyContent: 'space-between', gap: 10, marginTop: 5}}>
            <View style={[styles.total, {flex: 1}]}>
              <Text style={[styles.totalLabel, { color: 'white' }]}>Grand Total:</Text>
              <Text style={[styles.totalValue, { color: 'white' }]}>{formatVND(grandTotal)}</Text>
            </View>
            <View style={[styles.total, { backgroundColor: '#333', flex: 1 }]}>
              <Text style={[styles.totalLabel, { color: 'white' }]}>Deposit ({depositPercent}%):</Text>
              <Text style={[styles.totalValue, { color: 'white' }]}>{formatVND(depositAmount)}</Text>
            </View>
          </View>
        </View>

        {/* Terms & Conditions - more compact */}
        <View style={[styles.section, {marginBottom: 0}]}>
          <Text style={[styles.sectionTitle, { color: '#333', fontSize: 12 }]}>Terms and Conditions</Text>
          <Text style={[styles.termsText, { fontSize: 7 }]}>{terms || 'Payment due within 30 days. Cancellation policy: 50% refund if canceled 30 days before the event.'}</Text>
        </View>

        {/* Footer */}
        <View style={[styles.footer, { paddingTop: 5 }]}>
          <Text style={[styles.footerText, styles.highlight, { fontSize: 7 }]}>Season Decor - A Decoration Platform</Text>
          <Text style={[styles.footerText, { fontSize: 6 }]}>www.seasondecor.com | info@seasondecor.com | +84 123 456 789</Text>
        </View>
      </Page>
    </Document>
  );
};

// PDF Preview Component
export const PdfPreview = ({ quotationData }) => {
  return (
    <PDFViewer width="100%" height="100%" className="border rounded">
      <QuotationDocument data={quotationData} />
    </PDFViewer>
  );
};

// PDF Download Button Component
export const PdfDownloadButton = ({ quotationData }) => {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) {
    return (
      <Button
        label="Preparing..."
        icon={<IoDownloadOutline size={20} />}
        className="bg-gray-400"
        disabled
      />
    );
  }
  
  return (
    <PDFDownloadLink
      document={<QuotationDocument data={quotationData} />}
      fileName={`quotation-${quotationData.quotationNumber || 'download'}.pdf`}
    >
      {({ loading, error }) => (
        <Button
          label={loading || error ? "Preparing..." : "Download PDF"}
          icon={<IoDownloadOutline size={20} />}
          className={loading || error ? "bg-gray-400" : "bg-green-600"}
          disabled={loading || error}
        />
      )}
    </PDFDownloadLink>
  );
};

// Update the generatePdfBlob function to include additional customer data
export const generatePdfBlob = async (quotationData) => {
  // Include additional customer preference data for the PDF
  const enhancedData = {
    ...quotationData,
    // Use the themeColors array as is
    themeColors: quotationData.themeColors || [],
    // Extract booking form data
    spaceType: quotationData.bookingForm && quotationData.bookingForm.spaceStyle || 'N/A',
    roomSize: quotationData.bookingForm && quotationData.bookingForm.roomSize || 'N/A',
    primaryUser: quotationData.bookingForm && quotationData.bookingForm.primaryUser || 'N/A',
    // Use the scopeOfWorks array as is
    scopeOfWorks: quotationData.scopeOfWorks || [],
  };
  
  const pdfDoc = <QuotationDocument data={enhancedData} />;
  const blob = await pdf(pdfDoc).toBlob();
  return blob;
};

export default {
  PdfPreview,
  PdfDownloadButton
}; 
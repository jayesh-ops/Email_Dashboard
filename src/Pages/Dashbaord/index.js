import moment from 'moment-timezone';
import "../../App.css";

import {
  //DollarCircleOutlined,
  ShoppingCartOutlined,
  //ShoppingOutlined,
  //UserOutlined,
} from "@ant-design/icons";
import { Card, Space, Statistic, Table, Typography,Button, Modal, DatePicker, TimePicker, Select } from "antd";
import { useEffect, useState } from "react"; 
import {getdraftOrders,totaldraftOrders, scheduledEmaillist, scheduleEmail } from "../../API";
const { Option } = Select;

function Dashboard() {
  const [total_Draft_Orders, setTotaldraftOrder] = useState(0);

  useEffect(() => {
    totaldraftOrders().then((res) => {
      setTotaldraftOrder(res.total_Draft_Orders);
    });
  }, []);

  return (
    <Space size={20} direction="vertical">
      <Typography.Title level={4}>Draft Orders</Typography.Title>
      <Space direction="horizontal">
        <DashboardCard
          icon={
            <ShoppingCartOutlined
              style={{
                color: "green",
                backgroundColor: "rgba(0,255,0,0.25)",
                borderRadius: 20,
                fontSize: 24,
                padding: 8,
              }}
            />
          }
          title={"Total Draft Orders"}
          value={total_Draft_Orders}
        />
      </Space>
      <Space>
        <RecentOrders />
      </Space>
    </Space>
  );
}

function DashboardCard({ title, value, icon }) {
  return (
    <Card>
      <Space direction="horizontal">
        {icon}
        <Statistic title={title} value={value} />
      </Space>
    </Card>
  );
}

function RecentOrders() {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [availableProducts, setAvailableProducts] = useState([]); // List of available products
  const [scheduledEmails, setScheduledEmails] = useState([]); // List of scheduled emails


  useEffect(() => {
    getdraftOrders()
      .then((response) => {
        const products = response.map((order) => order.product_name);
        const uniqueProducts = [...new Set(products)];
        setAvailableProducts(uniqueProducts);
      })
      .catch((error) => {
        console.error('Error fetching products', error);
      });

    setLoading(true);
    getdraftOrders().then((res) => {
      // Sort the orders in reverse order based on order date
      const sortedOrders = res.sort((a, b) => new Date(b.order_date) - new Date(a.order_date));
      setDataSource(sortedOrders);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    // Fetch scheduled emails from the API when the component mounts
    scheduledEmaillist()
    .then((response) => {
      // Update the state with the fetched emails
      const emailsWithIST = response.map(email => ({
        ...email,
        scheduled_date: moment(email.scheduled_date).tz('Asia/Kolkata').format('YYYY-MM-DD'),
        scheduled_time: moment(email.scheduled_time).tz('Asia/Kolkata').format('HH:mm:ss'),
      }));
      setScheduledEmails(emailsWithIST);
    })
    .catch((error) => {
      console.error('Error fetching scheduled emails', error);
    });
}, []);

const handleSendAllEmails = () => {
  if (!selectedProduct || !selectedDate || !selectedTime) {
    console.error('Please select product, date, and time.');
    return;
  }

  const emailSubject = `Special Offer for ${selectedProduct}`;
  const emailText = `Dear {customer_name}, we have a special offer for you regarding ${selectedProduct}`;

  const selectedCustomers = dataSource.filter(
    (record) => record.product_name === selectedProduct
  );

  selectedCustomers.forEach((record) => {
    const personalizedEmailText = emailText.replace(
      '{customer_name}',
      record.customer_name
    );

    // Format the selectedDate as 'YYYY-MM-DD'
    const formattedDate = selectedDate.format('YYYY-MM-DD');

    // Format the selectedTime as HH:mm:ss
    const formattedTime = selectedTime.format('HH:mm:ss');

    // Send the selected data to the backend API
    scheduleEmail(
      record.customer_email,
      emailSubject,
      personalizedEmailText,
      selectedProduct,
      record.customer_name,
      formattedDate,
      formattedTime,
    );

    // Add the scheduled email to the state
    setScheduledEmails(prevScheduledEmails => [
      ...prevScheduledEmails,
      {
        customer_name: record.customer_name,
        customer_email: record.customer_email,
        product_name: selectedProduct,
        scheduled_date: formattedDate,
        scheduled_time: formattedTime,
      },
    ]);
  });

  setIsModalVisible(false);
};

  /*const sendEmail = (recipientEmail, emailSubject, emailText) => {
    axios
      .post('http://localhost:5026/api/send-email', { recipientEmail, emailSubject, emailText })
      .then((response) => {
        console.log('Email sent successfully');
      })
      .catch((error) => {
        console.error('Error sending email', error);
      });
  };*/

  return (
    <>
    <div className="recent-orders-list" >
      <Typography.Text><h3>Recent Orders</h3></Typography.Text>
      <div>
        <Table
          columns={[
            {
              title: 'Customer name',
              dataIndex: 'customer_name',
            },
            {
              title: 'Customer email',
              dataIndex: 'customer_email',
            },
            {
              title: 'Title',
              dataIndex: 'product_name',
            },
          ]}
          loading={loading}
          dataSource={dataSource}
          pagination={false}
          
        />
        </div>
        <Button
          type="primary"
          onClick={() => setIsModalVisible(true)}
          style={{ marginTop: '20px' }}
        >
          Schedule An Email
        </Button>
        <Modal
          title="Schedule an Email"
          visible={isModalVisible}
          onOk={handleSendAllEmails}
          onCancel={() => setIsModalVisible(false)}
        >
          <div>
            <label>Select Product:</label>
            <Select
              value={selectedProduct}
              onChange={(value) => setSelectedProduct(value)}
              style={{ width: '100%' }}
            >
              {availableProducts.map((product) => (
                <Option key={product} value={product}>
                  {product}
                </Option>
              ))}
            </Select>
          </div>
          <div style={{ margin: '10px 0' }}>
            <label>Select Date:</label>
            <DatePicker value={selectedDate} onChange={(date) => setSelectedDate(date)} />
          </div>
          <div>
            <label>Select Time:</label>
            <TimePicker
              value={selectedTime}
              onChange={(time) => setSelectedTime(time)}
            />
          </div>
        </Modal>
      </div>
      <Typography.Text><h3>Scheduled Emails</h3></Typography.Text>
    <Table
      columns={[
        {
          title: 'Customer name',
          dataIndex: 'customer_name',
        },
        {
          title: 'Customer email',
          dataIndex: 'recipient_email',
        },
        {
          title: 'Product',
          dataIndex: 'selected_product',
        },
        {
          title: 'Scheduled date',
          dataIndex: 'scheduled_date',
        },
        {
          title: 'Scheduled time',
          dataIndex: 'selected_time',
        },
      ]}
      dataSource={scheduledEmails.slice(-5).reverse()} // Reverse the array
      pagination={false}
      />
    </>
  );
}

export default Dashboard;
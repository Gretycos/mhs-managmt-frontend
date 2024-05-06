/**
 * author: Tsong
 * time: 2024/2/5 14:32
 */
import { useEffect, useState, useMemo } from "react";
import "./WorkShift.less";
import IntroBar from "@/component/IntroBar/IntroBar.jsx";
import {
  Input,
  Calendar,
  DatePicker,
  Radio,
  Button,
  Select,
  Row,
  Col,
} from "antd";
import dayjs from "dayjs";
const { Search } = Input;

const WorkShift = () => {
  const [options, setOptions] = useState([]);
  const [workTime, setWorkTime] = useState(1);
  const [selectUser, setSelectUser] = useState({
    user_id: "",
    user_name: "",
  });
  const [listData, setListData] = useState([]);
  const [disabledDate, setDisabledDate] = useState(false);

  const today = dayjs().format("YYYY-MM-DD");
  const [selectDate, setSelectDate] = useState(dayjs(today));

  const onPanelChange = (value, mode) => {
    console.log("onPanelChange", value, mode);
  };

  const changeShiftTime = (e) => {
    console.log("Shift time change to:", e.target.value);
    setWorkTime(e.target.value);
  };

  const onSelectPractitioner = (value) => {
    console.log("Select practitioner:", value);
    setSelectUser({
      user_id: value[0],
      user_name: value[1],
    });
  };

  const getSetListData = () => {
    const listData = [
      {
        type: 0,
        day: "2024-05-06",
      },
      {
        type: 1,
        day: "2024-05-01",
      },
      {
        type: 1,
        day: "2024-05-02",
      },
      {
        type: 2,
        day: "2024-05-03",
      },
      {
        type: 2,
        day: "2024-05-04",
      },
      {
        type: 1,
        day: "2024-05-05",
      },
      {
        type: 3,
        day: "2024-05-07",
      },
      {
        type: 3,
        day: "2024-05-09",
      },
    ];
    return listData || [];
  };

  const setDay = useMemo(() => {
    // 根据user_id查詢當前日期是否有排班
    return (value) => {
      const dateString = dayjs(value.$d).format("YYYY-MM-DD");
      for (let item of listData) {
        // console.log(
        //   "item",
        //   value.$d,
        //   dateString,
        //   item,
        //   item.day === dateString,
        //   item.type != 0
        // );
        if (item.day === dateString) {
          switch (item.type) {
            case 1:
              return (
                <div
                  style={{
                    backgroundColor: "green",
                    borderRadius: "50%",
                    width: "10px",
                    height: "10px",
                    margin: "3px auto",
                  }}
                ></div>
              );
            case 2:
              return (
                <div
                  style={{
                    backgroundColor: "blue",
                    borderRadius: "50%",
                    width: "10px",
                    height: "10px",
                    margin: "3px auto",
                  }}
                ></div>
              );
            case 3:
              return (
                <div
                  style={{
                    backgroundColor: "orange",
                    borderRadius: "50%",
                    width: "10px",
                    height: "10px",
                    margin: "3px auto",
                  }}
                ></div>
              );
          }
        }
      }
      return <></>;
    };
  }, [listData]);

  const option = [
    {
      value: ["JB1", "James Bond"],
      label: "James Bond",
    },
    {
      value: ["TC2", "Tim Cook"],
      label: "Tim Cook",
    },
    {
      value: ["EM3", "Elon Musk"],
      label: "Elon Musk",
    },
    {
      value: ["JB4", "Jeff Bezos"],
      label: "Jeff Bezos",
    },
    {
      value: ["BG5", "Bill Gates"],
      label: "Bill Gates",
    },
    {
      value: ["LP6", "Larry Page"],
      label: "Larry Page",
    },
  ];

  useEffect(() => {
    setListData(getSetListData());
    if (selectUser) {
      setSelectDate(dayjs(today));
      setWorkTime(1); // Assuming `null` is the original state
    }
  }, [selectUser]);

  const handleDateChange = (value) => {
    setSelectDate(dayjs(value));
    if (
      (value && value > dayjs().endOf("day").add(60, "day")) ||
      (value && value < dayjs().startOf("day"))
    ) {
      setDisabledDate(true);
    } else {
      setDisabledDate(false);
    }
    console.log("handleDateChange", dayjs(value).format("YYYY-MM-DD"));
  };

  return (
    <div className="work-shift">
      <IntroBar title="Add Individual Schedule" />
      <Select
        showSearch
        className="search-input"
        placeholder="Select practitioner"
        optionFilterProp="children"
        filterSort={(optionA, optionB) =>
          (optionA?.label ?? "")
            .toLowerCase()
            .localeCompare((optionB?.label ?? "").toLowerCase())
        }
        options={option}
        onSelect={onSelectPractitioner}
        value={selectUser.user_name ? selectUser.user_name : ""}
      />
      <div className="select-workday">
        <div>
          <Calendar
            fullscreen={false}
            onPanelChange={onPanelChange}
            onSelect={(value) => handleDateChange(value)}
            value={selectDate}
            defaultValue={dayjs().format("YYYY-MM-DD")}
            cellRender={(value) => setDay(value)}
            HeaderRender={({ value }) => {
              // 确保 value 是 Day.js 对象
              const currentValue = dayjs(value);

              const months = [];
              for (let i = 0; i < 12; i++) {
                months.push(currentValue.month(i).format("MMM"));
              }

              const year = currentValue.year();
              const yearOptions = [];
              for (let i = year - 10; i <= year + 10; i++) {
                yearOptions.push(
                  <Select.Option key={i} value={i}>
                    {i}
                  </Select.Option>
                );
              }

              const month = currentValue.month();
              const monthOptions = [];
              for (let i = 0; i < 12; i++) {
                monthOptions.push(
                  <Select.Option key={i} value={i}>
                    {months[i]}
                  </Select.Option>
                );
              }

              return (
                <div style={{ padding: 8 }} className="calender-header">
                  <Row gutter={8}>
                    <Col>
                      <Select
                        size="small"
                        value={year}
                        onChange={(newYear) =>
                          onChange(dayjs(value).year(newYear).month(month))
                        }
                      >
                        {yearOptions}
                      </Select>
                    </Col>
                    <Col>
                      <Select
                        size="small"
                        value={month}
                        onChange={(newMonth) =>
                          onChange(dayjs(value).year(year).month(newMonth))
                        }
                      >
                        {monthOptions}
                      </Select>
                    </Col>
                  </Row>
                </div>
              );
            }}
            className="calender"
          />
          <div className="color">
            <p className="green circle" />
            <span>Available</span>
            <p className="blue circle"></p>
            <span>Unavailable</span>
            <p className="orange circle"></p>
            <span>Day Off</span>
          </div>
        </div>

        <div className="workday">
          <p className="title">Shift Timetable</p>
          <p className="name">
            Name of the Practitioner:
            {` ${selectUser.user_name ? selectUser.user_name : ""}`}
          </p>
          <p>ID: {`${selectUser.user_id ? selectUser.user_id : ""}`}</p>
          <p>Select Date(s): </p>
          <DatePicker
            onChange={handleDateChange}
            disabled={selectUser.user_name ? false : true}
            needConfirm
            value={
              !disabledDate
                ? selectUser.user_name
                  ? selectDate
                  : dayjs()
                : selectDate
            }
            // defaultValue={dayjs().format("YYYY-MM-DD")}
            disabledDate={(current) => {
              return (
                (current &&
                  current > dayjs(today).endOf("day").add(60, "day")) ||
                (current && current < dayjs(today).startOf("day"))
              );
              // Can not select days before today
            }}
            className="date-picker"
            format={"YYYY/MM/DD"}
            picker="date"
          />
          <p>*Can only select 2 months from today.</p>
          <div className="shift">
            <Radio.Group
              onChange={changeShiftTime}
              value={workTime}
              className="items"
              disabled={
                !disabledDate
                  ? selectUser.user_name
                    ? false
                    : true
                  : disabledDate
              }
            >
              <Radio value={1}>Morning (8:00am - 12:00pm)</Radio>
              <Radio value={2}>Afternoon (12:00pm - 17:00pm)</Radio>
              <Radio value={3}>All Day (8:00am - 17:00pm)</Radio>
              <Radio value={4}>Day Off</Radio>
            </Radio.Group>
            <Button
              type="primary"
              className="submit"
              disabled={
                !disabledDate
                  ? selectUser.user_name
                    ? false
                    : true
                  : disabledDate
              }
            >
              Confirm
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkShift;

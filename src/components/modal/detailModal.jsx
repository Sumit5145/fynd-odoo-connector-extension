import React from 'react'
import { Col, Modal, Row } from "antd";

const DetailModal = (props) => {
    const { modalOpen, setModalOpen, title, data } = props;

    return (
        <Modal
            title={<span style={{
                fontWeight: "700"
            }}> {title}</span >}
            centered
            open={modalOpen}
            onOk={() => setModalOpen(false)}
            onCancel={() => setModalOpen(false)}
        >
            <div className="p-3">
                {data.map((row, index) => (
                    <Row key={index} gutter={[16, 16]} style={{ border: '1px solid #ddd', display: "flex", alignItems: "center" }}>
                        <Col span={6} style={{ background: "#F0F0F0", height: '40px', display: "flex", alignItems: "center", fontWeight: "700" }}>
                            <span>{row.key}</span>
                        </Col>
                        <Col span={18}>{row.value}</Col>
                    </Row>
                ))}
            </div>
        </Modal>
    )
}

export default DetailModal

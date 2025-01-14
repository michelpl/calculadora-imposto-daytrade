"use client"
import { Box, Button } from "@mui/material";
import styled from "styled-components";
import InputFileUpload from "./components/FileUpload";
import Table from "./components/Table";


const TestBox = styled(Box)`

`;

export default function Home() {
    return (
        <TestBox>
            <Button variant="contained">HomePage</Button>
            <InputFileUpload />
            <Table />
        </TestBox>
    );
}

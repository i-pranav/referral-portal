"use client";

import { Button } from "@/src/components/ui/button";
import { Card, CardX, CardContent, CardHeader } from "@/src/components/ui/card";
import { Status, UserRole } from "@prisma/client";
import { useEffect, useState } from "react";
import { MemberRow } from "../_components/memberRow";


import {
    Table,
    TableBody,
    TableCaption,
    TableHead,
    TableHeader,
    TableRow,
} from "@/src/components/ui/table"
import { RoleGate } from "@/src/components/auth/role-gate";
import { OrganizationRow } from "../_components/organizationRow";

interface organization {
    id: string;
    name: string
    normalizedLowerCase: string;
}

const OrganizationPage = () => {

    const [organizations, setOrganizations] = useState<organization[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/organizations'); // Adjust the API endpoint based on your actual setup
                const result = await response.json();
                setOrganizations(result.data || []); // Use an empty array as a default value if result.data is undefined or null
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);



    const deleteOrgData = (deletedOrg: organization) => {
        setOrganizations((prevOrganizations) => {
            // Filter out the deleted form based on its id
            const updatedOrganizations = prevOrganizations.filter((organization) => organization.id !== deletedOrg.id);
            return updatedOrganizations;
        });
    };

    return (

        <RoleGate allowedRole={[UserRole.ADMIN]}>
            <Card className="w-[90%] flex justify-center">
                <CardX className="w-[50%] m-2">
                    <CardHeader>
                        <p className="text-2xl font-semibold text-center">
                            Organizations
                        </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Table>
                            <TableCaption>End of list</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-center">Organization</TableHead>
                                    <TableHead className="text-center">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {organizations.map((organization) => (
                                    <OrganizationRow key={organization.id} orgData={organization} onDeleteOrgData={deleteOrgData} />
                                ))}
                            </TableBody >
                        </Table>
                    </CardContent>
                </CardX >
            </Card >

        </RoleGate >
    );
};

export default OrganizationPage;
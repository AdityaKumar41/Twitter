import { graphqlClient } from "@/client/api";
import { User } from "@/gql/graphql";
import { GetUserByIdQuery } from "@/graphql/query/user";
import { useCurrectUser } from "@/hooks/user";
import { IconArrowLeft } from "@tabler/icons-react";
import { GetServerSideProps, NextPage } from "next";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";

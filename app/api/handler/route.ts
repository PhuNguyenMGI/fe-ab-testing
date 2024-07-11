import { cookies } from "next/headers";

function allocateVariant(allVariants: any[]) {
  // Generate a random number between 0 and 100
  const randNum = Math.random() * 100;
  let cumulativePercentage = 0;

  for (const variant of allVariants) {
    cumulativePercentage += variant.percentage;
    if (randNum < cumulativePercentage) {
      return variant;
    }
  }
}

export async function GET() {
  const cookieVariant = cookies()
    .getAll()
    .find((item) => item.name.startsWith("cms.test."));
  const variantIds = cookieVariant?.value?.split("-");

  const response = await fetch(
    "https://63f2d751f28929a9df605107.mockapi.io/nttp/blog/2"
  ).then((res) => res.json());

  const dataDefault = JSON.parse(JSON.stringify(response));

  if (variantIds?.length) {
    const defaultId = variantIds[0];
    const variantId = variantIds[1];
    if (variantId) {
      const variantData = dataDefault.variants.find((item: any) => item.id === variantId);
      return new Response(JSON.stringify(variantData), { status: 200 });
    }
  } else {
    const variant = allocateVariant(dataDefault.variants);

    if (variant.id) {
      cookies().set(`cms.test.${dataDefault.id}-${variant.id}`, `${dataDefault.id}-${variant.id}`, { path: "/" });
    }

    const headers = new Headers();
    headers.append(
      "cookie",
      cookies()
        .getAll()
        .map((item) => `${item.name}=${item.value}`)
        .join("; ")
    );

    return new Response(JSON.stringify(variant), { status: 200, headers });
  }

  return new Response(JSON.stringify(dataDefault), { status: 200 });
}
export async function POST(request: Request) {
  const data = await request.json();
  await fetch("https://63f2d751f28929a9df605107.mockapi.io/nttp/blog/2", {
    method: "POST",
    body: JSON.stringify(data),
  });

  return new Response("Success", { status: 200 });
}

export async function PUT(request: Request) {
  const data = await request.json();
  await fetch("https://63f2d751f28929a9df605107.mockapi.io/nttp/blog/2", {
    method: "POST",
    body: JSON.stringify(data),
  });

  return new Response("Success", { status: 200 });
}
